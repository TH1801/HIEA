"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";

/** Publish article — admin only. Sets status='published' + published_at. */
export async function publishArticle(articleId: string): Promise<string | null> {
  const user = await getCurrentUser();
  if (!user || user.profile.role !== "admin") {
    return "Bạn không có quyền xuất bản bài viết.";
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("articles")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
    })
    .eq("id", articleId);

  if (error) return "Lỗi khi xuất bản bài viết.";

  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  revalidatePath("/tin-tuc");
  return null;
}

/** Reject article — admin only. Sets status='draft'. */
export async function rejectArticle(articleId: string): Promise<string | null> {
  const user = await getCurrentUser();
  if (!user || user.profile.role !== "admin") {
    return "Bạn không có quyền trả lại bài viết.";
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("articles")
    .update({ status: "draft" })
    .eq("id", articleId);

  if (error) return "Lỗi khi trả lại bài viết.";

  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  return null;
}

/** Delete article — draft only, by author or admin. */
export async function deleteArticle(articleId: string): Promise<string | null> {
  const user = await getCurrentUser();
  if (!user) return "Vui lòng đăng nhập.";

  const supabase = await createClient();

  // Verify article is draft and user has permission
  const { data: article } = await supabase
    .from("articles")
    .select("status, author_id")
    .eq("id", articleId)
    .single();

  if (!article) return "Không tìm thấy bài viết.";
  if (article.status !== "draft") return "Chỉ xóa được bài viết bản nháp.";
  if (user.profile.role !== "admin" && article.author_id !== user.id) {
    return "Bạn không có quyền xóa bài viết này.";
  }

  // Atomic delete with status guard to prevent TOCTOU race
  const { error, count } = await supabase
    .from("articles")
    .delete({ count: "exact" })
    .eq("id", articleId)
    .eq("status", "draft");

  if (error) return "Lỗi khi xóa bài viết.";
  if (count === 0) return "Bài viết đã thay đổi trạng thái, không thể xóa.";

  revalidatePath("/admin/dashboard");
  return null;
}

/** Change user password — requires authenticated session */
export async function changePassword(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const user = await getCurrentUser();
  if (!user) return "Vui lòng đăng nhập.";

  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!newPassword || newPassword.length < 6) {
    return "Mật khẩu phải có ít nhất 6 ký tự.";
  }
  if (newPassword !== confirmPassword) {
    return "Mật khẩu xác nhận không khớp.";
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) return "Lỗi khi đổi mật khẩu. Vui lòng thử lại.";
  return "success";
}
