"use client";

import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { convertCategory } from "@/lib/utils";
import { Category, PostCardType, PostSchema } from "@/types/post";
import {
  ArrowLeft,
  ArrowRight,
  ImageIcon,
  Loader2Icon,
  Rocket,
} from "lucide-react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStepStore } from "@/store/useStepStore";
import { PostCards } from "@/components/post-cards";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/app/api/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";

type PostData = z.infer<typeof PostSchema>;

export default function CreatePost() {
  const { step } = useStepStore();

  if (step === 1) {
    return <StepOne />;
  } else if (step === 2) {
    return <StepTwo />;
  } else {
    return <StepThree />;
  }
}

function StepOne() {
  const router = useRouter();
  const isSaved = localStorage.getItem("formData");
  const savedData: PostData | null = isSaved ? JSON.parse(isSaved) : null;
  const { addStep } = useStepStore();
  const {
    register,
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<PostData>({
    mode: "onChange",
    resolver: zodResolver(PostSchema),
    defaultValues: savedData || undefined,
  });

  const onSubmit = (data: PostData) => {
    localStorage.setItem("formData", JSON.stringify(data));
    addStep();
  };

  return (
    <div>
      <header className=" flex justify-between items-center px-4 py-4 md:px-8 md:py-8 lg:px-12">
        <Button
          className="bg-transparent text-black text-base font-semibold p-0"
          onClick={() => router.push("/")}
        >
          <ArrowLeft />
          Back
        </Button>

        <h1 className="font-bold text-lg font-clash">Create Post</h1>

        <Button disabled={!isValid} onClick={handleSubmit(onSubmit)}>
          Following
          <ArrowRight />
        </Button>
      </header>

      <main className="px-4 py-4 md:px-8 md:py-8 lg:px-12 flex justify-center items-center">
        <form className="lg:max-w-[65%] w-full grid lg:grid-cols-[2fr_1fr] gap-8">
          <section className="space-y-4">
            <div className="space-y-2">
              <Label className="font-bold text-base">Title</Label>
              <Input
                {...register("title")}
                className="border-[#d9d9d9] px-4 py-5"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-base">Description</Label>
              <Input
                {...register("description")}
                className="border-[#d9d9d9] px-4 py-5"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-base">Body</Label>
              <div className="border border-[#d9d9d9] h-[40vh] rounded-md relative max-w-full">
                <Controller
                  name="content"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <SimpleEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </section>
          <section className="space-y-4 grid md:grid-cols-2 md:grid-rows-1 md:space-x-8 lg:space-x-0 lg:grid-cols-1 lg:grid-rows-[1fr_2fr]">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Category</CardTitle>
              </CardHeader>
              <CardFooter className="bg-white">
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.values(Category).map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {convertCategory(cat)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Image</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-center items-center gap-4 h-full">
                <div className="border border-[#d9d9d9] rounded-md py-10 w-1/2 place-content-center place-items-center">
                  <ImageIcon
                    strokeWidth={1}
                    className="size-14 text-[#d9d9d9]"
                  />
                </div>

                <span className="text-[#d9d9d9]">Not available</span>
              </CardContent>
            </Card>
          </section>
        </form>
      </main>
    </div>
  );
}

function StepTwo() {
  const router = useRouter();
  const isSaved = localStorage.getItem("formData");
  const savedData: PostData | null = isSaved ? JSON.parse(isSaved) : null;
  const [selectedType, setSelectedType] = useState<PostCardType | null>(null);
  const { decrStep } = useStepStore();
  const createPost = useMutation({
    mutationKey: ["create-post"],
    mutationFn: async (data: PostData & { postType: PostCardType | null; published: boolean }) => {
      await api.post("user/post", data);
    },

    onSuccess: () => {
      router.push("/home");
      toast.success("Post created successfully!");
      localStorage.removeItem("formData");
    },

    onError: (error: unknown) => {
      if (axios.isAxiosError(error) && error.response) {
        toast.error("Error: Try again later.");
      } else {
        console.error("Error: ", error);
      }
    },
  });

  const onSubmit = () => {
    if (!savedData || !savedData.title || !savedData.description || !savedData.category || !savedData.content) {
      toast.error("Please fill in all required fields");
      return;
    }
    const payload = { ...savedData, postType: selectedType, published: true };
    createPost.mutate(payload);
  };

  return (
    <div>
      <header className=" flex justify-between items-center px-4 py-4 md:px-8 md:py-8 lg:px-12">
        <Image src={"/blog-logo.svg"} width={100} height={100} alt="logo" />

        <h1 className="font-bold text-lg font-clash">Select an Post Type</h1>

        <div className="flex items-center gap-4">
          <Button onClick={decrStep} className="bg-border px-4 text-black">
            <ArrowLeft />
            Back
          </Button>
          <Button
            className="px-4"
            disabled={!selectedType || createPost.isPending}
            onClick={onSubmit}
          >
            {createPost.isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <>
                <Rocket />
                Publish
              </>
            )}
          </Button>
        </div>
      </header>

      <main className="grid md:grid-cols-2 grid-rows-5 gap-4 p-12">
        <PostCards
          type={PostCardType.TOP_RIGHT}
          categoryTag={savedData?.category ?? Category.TECH}
          date="Feb 20"
          title={savedData?.title ?? ""}
          description={savedData?.description ?? ""}
          likes={0}
          comments={0}
          clickable={true}
          isSelected={selectedType === PostCardType.TOP_RIGHT}
          onSelect={() => setSelectedType(PostCardType.TOP_RIGHT)}
        />

        <PostCards
          type={PostCardType.TOP_LEFT}
          categoryTag={savedData?.category ?? Category.TECH}
          date="Feb 20"
          title={savedData?.title ?? ""}
          description={savedData?.description ?? ""}
          likes={0}
          comments={0}
          clickable={true}
          isSelected={selectedType === PostCardType.TOP_LEFT}
          onSelect={() => setSelectedType(PostCardType.TOP_LEFT)}
        />

        <PostCards
          type={PostCardType.BOTTOM_LEFT}
          categoryTag={savedData?.category ?? Category.TECH}
          date="Feb 20"
          title={savedData?.title ?? ""}
          description={savedData?.description ?? ""}
          likes={0}
          comments={0}
          clickable={true}
          isSelected={selectedType === PostCardType.BOTTOM_LEFT}
          onSelect={() => setSelectedType(PostCardType.BOTTOM_LEFT)}
        />

        <PostCards
          type={PostCardType.BOTTOM_RIGHT}
          categoryTag={savedData?.category ?? Category.TECH}
          date="Feb 20"
          title={savedData?.title ?? ""}
          description={savedData?.description ?? ""}
          likes={0}
          comments={0}
          clickable={true}
          isSelected={selectedType === PostCardType.BOTTOM_RIGHT}
          onSelect={() => setSelectedType(PostCardType.BOTTOM_RIGHT)}
        />
      </main>
    </div>
  );
}

function StepThree() {
  return <h1> Step3</h1>;
}
