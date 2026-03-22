"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slugify";

/** Create a new draft article, return its id */
export async function createArticle(): Promise<{
  id: string | null;
  error: string | null;
}> {
  const user = await getCurrentUser();
  if (!user) return { id: null, error: "Vui lòng đăng nhập." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .insert({ author_id: user.id, status: "draft" })
    .select("id")
    .single();

  if (error) return { id: null, error: "Lỗi khi tạo bài viết." };
  return { id: data.id, error: null };
}

/** Auto-save article — PATCH title, content, category, slug */
export async function updateArticle(
  articleId: string,
  payload: {
    title?: string;
    content?: Record<string, unknown>;
    category_id?: string;
    updated_at?: string;
  }
): Promise<{ error: string | null; conflict: boolean; updated_at: string | null }> {
  const user = await getCurrentUser();
  if (!user) return { error: "Vui lòng đăng nhập.", conflict: false, updated_at: null };

  const supabase = await createClient();

  // Always fetch current article for permission check + conflict detection
  const { data: current } = await supabase
    .from("articles")
    .select("updated_at, author_id, status")
    .eq("id", articleId)
    .single();

  if (!current) return { error: "Không tìm thấy bài viết.", conflict: false, updated_at: null };

  // Editor can only edit own drafts
  if (user.profile.role === "editor") {
    if (current.author_id !== user.id)
      return { error: "Không có quyền chỉnh sửa.", conflict: false, updated_at: null };
    if (current.status !== "draft")
      return { error: "Chỉ chỉnh sửa được bài nháp.", conflict: false, updated_at: null };
  }

  // Conflict detection — compare timestamps (skip on first save when no updated_at provided)
  if (payload.updated_at && current.updated_at !== payload.updated_at) {
    return { error: "Bài viết đã được chỉnh sửa bởi người khác.", conflict: true, updated_at: current.updated_at };
  }

  // Build update data with auto-generated slug from title
  const updateData: Record<string, unknown> = {};
  if (payload.title !== undefined) {
    updateData.title = payload.title;
    updateData.slug = slugify(payload.title);
  }
  if (payload.content !== undefined) {
    updateData.content = payload.content;
    // DEBUG: Check if content contains image nodes before saving
    const json = JSON.stringify(payload.content);
    if (json.includes('"type":"image"') || json.includes('"type": "image"')) {
      console.log(`[updateArticle] Saving content with image nodes for article ${articleId}`);
    }
  }
  if (payload.category_id !== undefined) updateData.category_id = payload.category_id;

  const { data: updated, error } = await supabase
    .from("articles")
    .update(updateData)
    .eq("id", articleId)
    .select("updated_at")
    .single();

  if (error) return { error: "Lỗi khi lưu bài viết.", conflict: false, updated_at: null };
  return { error: null, conflict: false, updated_at: updated.updated_at };
}

/** Submit article for review — draft → pending */
export async function submitForReview(
  articleId: string
): Promise<string | null> {
  const user = await getCurrentUser();
  if (!user) return "Vui lòng đăng nhập.";

  const supabase = await createClient();

  const { data: article } = await supabase
    .from("articles")
    .select("status, author_id, title, category_id")
    .eq("id", articleId)
    .single();

  if (!article) return "Không tìm thấy bài viết.";
  if (!article.title?.trim()) return "Vui lòng nhập tiêu đề trước khi gửi duyệt.";
  if (!article.category_id) return "Vui lòng chọn danh mục trước khi gửi duyệt.";
  if (article.status !== "draft") return "Chỉ gửi duyệt bài nháp.";
  if (user.profile.role === "editor" && article.author_id !== user.id) {
    return "Không có quyền gửi duyệt bài viết này.";
  }

  const { error } = await supabase
    .from("articles")
    .update({ status: "pending" })
    .eq("id", articleId);

  if (error) return "Lỗi khi gửi duyệt.";

  revalidatePath("/admin/dashboard");
  return null;
}

/** Upload file attachment to Supabase Storage, return public URL */
export async function uploadAttachment(
  formData: FormData
): Promise<{ url: string | null; error: string | null }> {
  const user = await getCurrentUser();
  if (!user) return { url: null, error: "Vui lòng đăng nhập." };

  const file = formData.get("file") as File | null;
  if (!file) return { url: null, error: "Không tìm thấy tệp." };

  // Validate file size (20MB max)
  if (file.size > 20 * 1024 * 1024) {
    return { url: null, error: "Tệp quá lớn (tối đa 20MB)." };
  }

  const supabase = await createClient();
  const ext = file.name.split(".").pop() ?? "pdf";
  const path = `articles/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("attachments")
    .upload(path, file, { contentType: file.type });

  if (error) return { url: null, error: "Lỗi khi tải tệp lên." };

  const { data: urlData } = supabase.storage
    .from("attachments")
    .getPublicUrl(path);

  return { url: urlData.publicUrl, error: null };
}

/** Upload editor image to Supabase Storage, return public URL */
export async function uploadEditorImage(
  formData: FormData
): Promise<{ url: string | null; error: string | null }> {
  const user = await getCurrentUser();
  if (!user) return { url: null, error: "Vui lòng đăng nhập." };

  const file = formData.get("file") as File | null;
  if (!file) return { url: null, error: "Không tìm thấy tệp." };

  const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
  const allowedExts = ["png", "jpg", "jpeg", "webp"];
  const ext = (file.name.split(".").pop() ?? "").toLowerCase();
  if (!allowedTypes.includes(file.type) || !allowedExts.includes(ext)) {
    return { url: null, error: "Chỉ chấp nhận ảnh PNG, JPG, JPEG, WEBP." };
  }

  if (file.size > 2 * 1024 * 1024) {
    return { url: null, error: "Ảnh quá lớn (tối đa 2MB)." };
  }

  const supabase = await createClient();
  const storagePath = `editor-images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("attachments")
    .upload(storagePath, file, { contentType: file.type });

  if (error) return { url: null, error: "Lỗi khi tải ảnh lên." };

  const { data: urlData } = supabase.storage
    .from("attachments")
    .getPublicUrl(storagePath);

  return { url: urlData.publicUrl, error: null };
}

/** Remove attachment from storage and clear article field */
export async function removeAttachment(
  articleId: string,
  attachmentUrl: string
): Promise<string | null> {
  const user = await getCurrentUser();
  if (!user) return "Vui lòng đăng nhập.";

  const supabase = await createClient();

  // Extract storage path from URL
  const pathMatch = attachmentUrl.match(/attachments\/(.+)$/);
  if (pathMatch) {
    await supabase.storage.from("attachments").remove([pathMatch[1]]);
  }

  const { error } = await supabase
    .from("articles")
    .update({ attachment_url: null })
    .eq("id", articleId);

  if (error) return "Lỗi khi xóa tệp đính kèm.";
  return null;
}
