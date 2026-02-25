import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Heart, MessageCircle, ArrowUpRight } from "lucide-react";
import { Category, PostCardType } from "@/types/post";
import { convertCategory } from "@/lib/utils";

type PostCardsProps = {
  type: PostCardType;
  categoryTag: Category;
  date: string;
  title: string;
  description?: string;
  image?: string;
  likes: number;
  comments: number;
};

const colorSchemes = {
  [PostCardType.TOP_LEFT]: {
    bg: "bg-primary-00",
    text: "text-gray-900",
  },
  [PostCardType.TOP_RIGHT]: {
    bg: "bg-primary-10",
    text: "text-gray-900",
  },
  [PostCardType.BOTTOM_LEFT]: {
    bg: "bg-primary-20",
    text: "text-gray-900",
  },
  [PostCardType.BOTTOM_RIGHT]: {
    bg: "bg-primary-30",
    text: "text-black",
  },
};

export const PostCards = ({
  type,
  categoryTag,
  date,
  title,
  description,
  image,
  likes,
  comments,
  isSelected = false,
  onSelect,
  clickable = true,
}: PostCardsProps & {
  isSelected?: boolean;
  onSelect?: () => void;
  clickable?: boolean;
}) => {
  const colors = colorSchemes[type];
  const isTopLayout = type.startsWith("TOP");

  return (
    <Card
      onClick={clickable ? onSelect : undefined}
      className={`
        relative overflow-hidden rounded-3xl border-0 transition
        ${colors.bg} ${colors.text} 
        ${clickable ? "cursor-pointer" : "cursor-default"}
        ${clickable && isSelected ? "ring-2 ring-black scale-[1.01]" : ""}
      `}
    >
      {isTopLayout ? (
        <div className="flex flex-col h-full">
          <CardHeader className="pb-3 pt-6 px-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold">
                  Category{" "}
                  <span className="font-normal">
                    . {convertCategory(categoryTag)}
                  </span>
                </p>
                <p className="text-sm mt-1">
                  {new Date(date).toDateString().slice(4, 15)}
                </p>
              </div>

              {/* Mantemos o botão lateral sempre funcional */}
              <button
                className={`p-2 rounded-full ${
                  colors.text === "text-white" ? "bg-gray-900" : "bg-white"
                }`}
              >
                <ArrowUpRight
                  size={20}
                  className={
                    colors.text === "text-white"
                      ? "text-white"
                      : "text-gray-900"
                  }
                />
              </button>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-4 flex-1">
            <h2 className="text-2xl font-bold mb-4 leading-tight">{title}</h2>

            {description && (
              <p className="text-sm mb-6 leading-relaxed">{description}</p>
            )}

            {image && (
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
            )}
          </CardContent>

          <CardFooter className="px-6 pb-6 flex gap-4 border-t-0 bg-none">
            <div className="flex items-center gap-2">
              <Heart size={20} />
              <span className="text-sm font-medium">{likes}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <span className="text-sm font-medium">{comments}</span>
            </div>
          </CardFooter>
        </div>
      ) : (
        /* -------- BOTTOM LAYOUT -------- */
        <div className="flex flex-col h-full">
          <CardHeader className="pb-3 pt-6 px-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold">
                  Category{" "}
                  <span className="font-normal">
                    . {convertCategory(categoryTag)}
                  </span>
                </p>
                <p className="text-sm mt-1">
                  {new Date(date).toDateString().slice(4, 15)}
                </p>
              </div>

              {/* Mantemos o botão lateral sempre funcional */}
              <button
                className={`p-2 rounded-full ${
                  colors.text === "text-white" ? "bg-gray-900" : "bg-white"
                }`}
              >
                <ArrowUpRight
                  size={20}
                  className={
                    colors.text === "text-white"
                      ? "text-white"
                      : "text-gray-900"
                  }
                />
              </button>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-4 flex-1">
            <h2 className="text-2xl font-bold mb-4 leading-tight">{title}</h2>

            {description && (
              <p className="text-sm mb-6 leading-relaxed">{description}</p>
            )}

            {image && (
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
            )}
          </CardContent>

          <CardFooter className="px-6 pb-6 flex gap-4 border-t-0 bg-none">
            <div className="flex items-center gap-2">
              <Heart size={20} />
              <span className="text-sm font-medium">{likes}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <span className="text-sm font-medium">{comments}</span>
            </div>
          </CardFooter>
        </div>
      )}
    </Card>
  );
};
