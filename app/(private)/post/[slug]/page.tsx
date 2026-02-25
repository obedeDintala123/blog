"use client";

import { Header } from "@/components/header";
import { PostDetail } from "@/components/post-detail";
import { usePostBySlug } from "@/lib/requests";
import { useParams } from "next/navigation";

export default function PostPage() {
  const { slug } = useParams();
  const { data } = usePostBySlug(slug);
  return (
    <div>
      <Header />

      <main>
        <section>
          <PostDetail post={data} />
        </section>
      </main>
    </div>
  );
}
