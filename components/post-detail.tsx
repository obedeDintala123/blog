"use client";

import Image from "next/image";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import { IPost } from "@/types/post";
import { convertCategory } from "@/lib/utils";
import { useEditor, EditorContent, EditorContext } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Selection } from "@tiptap/extensions";
import { Image as TiptapImage } from "@tiptap/extension-image";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMe } from "@/lib/requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/api/api";
import { LikeButton } from "./liked-button";

export const PostDetail = ({
  post,
  isLoading,
}: {
  post: IPost;
  isLoading: boolean;
}) => {
  const { data: user } = useMe();
  const router = useRouter();
  const [shareModal, setShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openLikeDialog, setOpenLikeDialog] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const queryClient = useQueryClient();

  const { mutate: toggleLike } = useMutation({
    mutationFn: (postId: number) => api.post(`/post/${postId}/like`),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["post-slug", post.slug] });
      const previousPost = queryClient.getQueryData(["post-slug", post.slug]);

      queryClient.setQueryData(["post-slug", post.slug], (old: IPost) => ({
        ...old,
        _count: {
          ...old._count,
          likedBy: old.likedByMe
            ? old._count.likedBy - 1
            : old._count.likedBy + 1,
        },
        likedByMe: !old.likedByMe,
      }));

      return { previousPost };
    },

    onError: (err, postId, context) => {
      queryClient.setQueryData(["post-slug", post.slug], context?.previousPost);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["post-slug", post.slug] });
      queryClient.invalidateQueries({ queryKey: ["public-posts"], exact: false }); 
    },
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLike = () => {
    if (!user) {
      setOpenLikeDialog(true);
      return;
    }

    toggleLike(post.id);
  };
  if (isLoading) {
    return (
      <article className="w-full max-w-3xl mx-auto px-6">
        <header className="mb-8">
          <Skeleton className="h-8 w-20 mb-6" />
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-full mb-6" />
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-12" />
            </div>
          </div>
        </header>
        <Skeleton className="mb-12 w-full h-96 rounded-lg" />
        <div className="mt-8 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <footer className="mt-12 mb-8 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-24" />
          </div>
        </footer>
      </article>
    );
  }

  return (
    <>
      <article className="w-full max-w-3xl mx-auto px-6">
        <header className="mb-8">
          <Button
            onClick={() => router.push("/home")}
            className="mb-6 bg-transparent text-black text-md font-bold p-0"
          >
            <ArrowLeft />
            Back
          </Button>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-lg mb-6">{post.description}</p>

          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <span className="font-semibold">
                  {post.author?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold">{post.author?.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toDateString().slice(4, 15)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <LikeButton
                count={post._count.likedBy}
                likedByMe={post.likedByMe ?? false}
                onClick={handleLike}
              />
              <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                <MessageCircle size={20} />
                <span className="text-sm">{post._count.comments}</span>
              </button>
            </div>
          </div>
        </header>

        {post.coverImage && (
          <div className="mb-12 w-full h-96 relative rounded-lg overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="mt-8">
          <RichContent content={post.content} />
        </div>

        <footer className="mt-12 mb-8 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <p>
                Category:{" "}
                <span className="font-semibold">
                  {convertCategory(post.category)}
                </span>
              </p>
            </div>
            <Button
              onClick={() => setShareModal(true)}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors text-sm font-semibold"
            >
              Share
              <Share2 />
            </Button>
          </div>
        </footer>
      </article>

      {/* Share Dialog */}
      <Dialog open={shareModal} onOpenChange={setShareModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Partilhar artigo</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-500 line-clamp-2">{post.title}</p>

          <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">
            <span className="flex-1 text-sm text-gray-600 truncate select-all">
              {shareUrl}
            </span>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                copied
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-900 text-white hover:bg-gray-700"
              }`}
            >
              {copied ? (
                <>
                  <Check size={14} />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copiar
                </>
              )}
            </button>
          </div>

          {typeof navigator !== "undefined" && "share" in navigator && (
            <Button
              onClick={async () => {
                try {
                  await navigator.share({
                    title: post.title,
                    text: post.description,
                    url: shareUrl,
                  });
                } catch {}
              }}
              className="w-full bg-gray-900 text-white hover:bg-gray-700 rounded-xl py-2.5 text-sm font-semibold"
            >
              <Share2 size={16} />
              Partilhar via...
            </Button>
          )}
        </DialogContent>
      </Dialog>

      <AlertSignIn
        openLikeDialog={openLikeDialog}
        setOpenLikeDialog={setOpenLikeDialog}
      />
    </>
  );
};

function RichContent({ content }: { content: any }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage.configure({
        resize: {
          enabled: true,
          directions: ["top", "bottom", "left", "right"],
          minWidth: 50,
          minHeight: 50,
          alwaysPreserveAspectRatio: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Typography,
      Superscript,
      Subscript,
      Selection,
    ],
    content: content,
    editable: false,
    immediatelyRender: false,
  });

  return (
    <div className="simple-editor-wrapper flex flex-col h-full">
      <EditorContext.Provider value={{ editor }}>
        <div className="overflow-y-auto flex-1">
          <EditorContent
            editor={editor}
            role="presentation"
            className="simple-editor-content"
          />
        </div>
      </EditorContext.Provider>
    </div>
  );
}

function AlertSignIn({ openLikeDialog, setOpenLikeDialog }: {
  openLikeDialog: boolean,
  setOpenLikeDialog: (value: boolean) => void;
}) {
  const router = useRouter();

  return (
    <Dialog open={openLikeDialog} onOpenChange={setOpenLikeDialog}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Sign in to continue
          </DialogTitle>
          <DialogDescription className="text-gray-500 mt-1">
            You need to be signed in to like posts.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col mt-2">
          <Button
            onClick={() => router.push("/auth/signin")}
            className="w-full bg-gray-900 text-white hover:bg-gray-700"
          >
            Sign in
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/auth/signup")}
            className="w-full"
          >
            Create an account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
