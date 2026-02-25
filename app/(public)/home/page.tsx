"use client";

import { Header } from "@/components/header";
import { PostCards } from "@/components/post-cards";
import { usePosts } from "@/lib/requests";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: posts, isLoading } = usePosts();
  const router = useRouter();

  return (
    <div>
      <Header />
      <main className="grid md:grid-cols-2 grid-rows-5 gap-4 px-4 py-4 md:px-8 md:py-8 lg:px-12">
        {/* Skeletons sem border */}
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col p-4 rounded-xl gap-4 bg-gray-100"
            >
              <Skeleton className="h-4 w-24 bg-gray-200" />
              <Skeleton className="h-6 w-3/4 bg-gray-200" />
              <Skeleton className="h-4 w-full bg-gray-200" />
              <Skeleton className="h-4 w-5/6 bg-gray-200" />
              <Skeleton className="h-20 w-full bg-gray-100" />
            </div>
          ))}

        {posts &&
          posts.map((post) => (
            <PostCards
              key={post.id}
              type={post.postType}
              categoryTag={post.category}
              date={post.createdAt}
              title={post.title}
              description={post.description}
              likes={post._count.likedBy}
              comments={post._count.comments}
              clickable={true}
              onSelect={() => router.push(`/post/${post.slug}`)}
            />
          ))}
      </main>
    </div>
  );
}
