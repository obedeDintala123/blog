import { api } from "@/app/api/api";
import { IPost } from "@/types/post";
import { useQuery } from "@tanstack/react-query";
import { UserType } from "@/types/user";

export const useMe = () => {
  return useQuery<UserType>({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await api.get("auth/me");
      return response.data;
    },
    retry: false,
  });
};

export const usePosts = () => {
  return useQuery<IPost[]>({
    queryKey: ["public-posts"],
    queryFn: async () => {
      const response = await api.get("post/public");
      return response.data.posts;
    },
  });
};

export const usePostBySlug = (slug: string) => {
  return useQuery<IPost>({
    queryKey: ["post-slug", slug],
    queryFn: async () => {
      const response = await api.get(`post/${slug}`);
      return response.data;
    },
  });
};
