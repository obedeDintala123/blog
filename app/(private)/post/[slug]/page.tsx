"use client";

import { Header } from "@/components/header";
import { PostDetail } from "@/components/post-detail";
import { usePostBySlug } from "@/lib/requests";
import { useParams } from "next/navigation";

export default function PostPage() {
  const { slug } = useParams();
  const { data, isLoading } = usePostBySlug(slug as string);
  return (
    <div>
      <Header />

      <main>
        <section>
          {data && <PostDetail isLoading={isLoading} post={data} />}
        </section>
      </main>
    </div>
  );
}
