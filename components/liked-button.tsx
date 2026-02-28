import { Heart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function LikeButton({
  count,
  likedByMe,
  onClick,
}: {
  count: number;
  likedByMe: boolean;
  onClick: () => void;
}) {
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    if (!likedByMe && !animating) {
      // ✅ só anima quando vai dar like
      setAnimating(true);
      setTimeout(() => setAnimating(false), 800);
    }
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 transition-colors relative"
    >
      <span className="relative flex items-center justify-center">
        {animating && (
          <span className="absolute -top-6 -left-4 w-12 h-12 pointer-events-none z-10">
            <Image width={12} height={12} src="/like-button.gif" alt="like"  />
          </span>
        )}
        <Heart
          size={20}
          className={`transition-all duration-300 ${
            likedByMe || animating //
              ? "fill-red-500 text-red-500 scale-110"
              : "fill-none text-current scale-100"
          }`}
        />
      </span>
      <span className="text-sm">{count}</span>
    </button>
  );
}
