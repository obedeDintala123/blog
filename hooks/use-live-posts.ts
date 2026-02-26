import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

export const useLivePosts = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API!);

    socket.on("new-post", () => {
      queryClient.refetchQueries({ queryKey: ["public-posts"] });
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);
};