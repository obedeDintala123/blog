import { api } from "@/app/api/api";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await api.get(`/post/${slug}`);

  return {
    title: `Blog - ${data.title}`,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      images: [`${process.env.NEXT_PUBLIC_APP_URL}/favicon.svg`],
    },
  };
}

export default function PostLayout({ children }: Props) {
  return (
    <main>
      {children}
    </main>
  );
}