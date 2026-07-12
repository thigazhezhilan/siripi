import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../lib/auth/AuthContext";
import { supabase } from "../lib/supabase";
import { uploadImageToProfilePhotos } from "../lib/storage/uploadImage";

export type OwnPhoto = {
  id: string;
  profile_id: string;
  storage_path: string;
  is_primary: boolean;
  visibility: "public" | "blurred_until_interest" | "private";
  moderation_status: "pending" | "approved" | "rejected";
};

export function photoPublicUrl(storagePath: string): string {
  const { data } = supabase.storage.from("profile-photos").getPublicUrl(storagePath);
  return data.publicUrl;
}

export function useOwnPhotos() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ["photos", userId],
    queryFn: async (): Promise<OwnPhoto[]> => {
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .eq("profile_id", userId as string)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as OwnPhoto[];
    },
    enabled: !!userId,
  });
}

export function useAddPhoto() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, isPrimary }: { file: File; isPrimary: boolean }) => {
      if (!userId) throw new Error("Not authenticated");

      const path = await uploadImageToProfilePhotos(userId, file);

      const { error: insertError } = await supabase.from("photos").insert({
        profile_id: userId,
        storage_path: path,
        is_primary: isPrimary,
        visibility: "blurred_until_interest",
        moderation_status: "approved",
      });
      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos", userId] });
    },
  });
}

export function useSetPrimaryPhoto() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (photoId: string) => {
      if (!userId) throw new Error("Not authenticated");

      const { error: clearError } = await supabase
        .from("photos")
        .update({ is_primary: false })
        .eq("profile_id", userId);
      if (clearError) throw clearError;

      const { error: setError } = await supabase.from("photos").update({ is_primary: true }).eq("id", photoId);
      if (setError) throw setError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos", userId] });
    },
  });
}

export function useRemovePhoto() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (photo: OwnPhoto) => {
      const { error: storageError } = await supabase.storage.from("profile-photos").remove([photo.storage_path]);
      if (storageError) throw storageError;

      const { error: deleteError } = await supabase.from("photos").delete().eq("id", photo.id);
      if (deleteError) throw deleteError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos", userId] });
    },
  });
}
