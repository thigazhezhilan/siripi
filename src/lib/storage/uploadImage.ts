import { supabase } from "../supabase";

export async function uploadImageToProfilePhotos(
  userId: string,
  file: File,
  prefix = ""
): Promise<string> {
  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const contentType = file.type || `image/${fileExt === "jpg" ? "jpeg" : fileExt}`;
  const path = `${userId}/${prefix}${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage.from("profile-photos").upload(path, file, { contentType });
  if (error) throw error;

  return path;
}
