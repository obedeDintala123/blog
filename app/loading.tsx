import Image from "next/image";

export default function Loading() {
  return (
    <div className="h-screen bg-white flex justify-center items-center">
      <Image width={100} height={100} alt="logo" src={"/blog-logo.svg"} className="animate-scale"/>
    </div>
  );
}
