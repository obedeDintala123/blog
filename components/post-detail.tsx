"use client";

import Image from "next/image";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Copy,
  Check,
  X,
} from "lucide-react";
import { IPost } from "@/types/post";
import { convertCategory } from "@/lib/utils";
import { useEditor, EditorContent, EditorContext } from "@tiptap/react";
// --- Tiptap Core Extensions ---
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
import { useState, useEffect, useRef } from "react";

export const PostDetail = ({ post }: { post: IPost }) => {
  const router = useRouter();
  const [shareModal, setShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = () => {
    setShareModal(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
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

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShareModal(false);
      }
    };
    if (shareModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [shareModal]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShareModal(false);
    };
    if (shareModal) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [shareModal]);

  if (!post) return null;

  return (
    <>
      <article className="w-full max-w-3xl mx-auto px-6">
        {/* Header */}
        <header className="mb-8">
          <Button
            onClick={() => router.push("/home")}
            className="mb-6 bg-transparent text-black text-md font-bold p-0"
          >
            <ArrowLeft />
            Back
          </Button>
          <h1 className="text-4xl font-bold  mb-4">{post.title}</h1>
          <p className="text-lg  mb-6">{post.description}</p>

          {/* Author and Date */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <span className=" font-semibold">
                  {post.author?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold "> {post.author?.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toDateString().slice(4, 15)}
                </p>
              </div>
            </div>

            {/* Engagement */}
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2  hover:text-red-500 transition-colors">
                <Heart size={20} />
                <span className="text-sm">{post._count.likedBy}</span>
              </button>
              <button className="flex items-center gap-2  hover:text-blue-500 transition-colors">
                <MessageCircle size={20} />
                <span className="text-sm">{post._count.comments}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Cover Image */}
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

        {/* Content */}
        <div className="mt-8">
          <RichContent content={post.content} />
        </div>

        {/* Footer */}
        <footer className="mt-12 mb-8 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <p>
                Cateogry:{" "}
                <span className="font-semibold">
                  {convertCategory(post.category)}
                </span>
              </p>
            </div>
            <Button
              onClick={handleShare}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors text-sm font-semibold"
            >
              Share
              <Share2 />
            </Button>
          </div>
        </footer>
      </article>

      {/* Share Modal */}
      {shareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-2xl w-[90%] md:w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                Partilhar artigo
              </h2>
              <button
                onClick={() => setShareModal(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            {/* Post title preview */}
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">
              {post.title}
            </p>

            {/* URL Input + Copy */}
            <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl mb-4">
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

            {/* Native Share (mobile) */}
            {typeof navigator !== "undefined" && "share" in navigator && (
              <Button
                onClick={async () => {
                  try {
                    await navigator.share({
                      title: post.title,
                      text: post.description,
                      url: shareUrl,
                    });
                  } catch {
                    // User cancelled or not supported
                  }
                }}
                className="w-full bg-gray-900 text-white hover:bg-gray-700 rounded-xl py-2.5 text-sm font-semibold transition-colors"
              >
                <Share2 size={16} />
                Partilhar via...
              </Button>
            )}
          </div>
        </div>
      )}
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
