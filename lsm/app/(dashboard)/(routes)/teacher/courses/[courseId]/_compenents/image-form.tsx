"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import  Image  from "next/image";

// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormMessage,
// } from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";

interface ImageFormProps {
    initialData: Course
    courseId: string;
}

const formSchema = z.object({
    imageUrl: z.string().min(1,{
        message: "Image is required"
    })
});

export const ImageForm = (
    {
        initialData,
        courseId
    } : ImageFormProps
) => {

    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => {
        logs();
        setIsEditing((current) => !current)
    }
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            imageUrl: initialData?.imageUrl || ""
        }
    })

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
         try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course updated");
            toggleEdit();
            router.refresh();
         }catch {
            toast.error("Someting went wrong!");
         }
    }

    const logs = () => {
        console.log("-=-==-=-=-=-=>> ", initialData?.imageUrl);
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Image
                <Button onClick={toggleEdit} variant={"ghost"}>
                    { isEditing && ( // editing...
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.imageUrl && (
                        // no image and not editing at all.
                        <>
                            <PlusCircle className="h-4 w-4 mr-2"/>
                            Add an image
                        </>
                    )

                    }
                    {!isEditing && initialData.imageUrl && (
                        // image exist but not editing, show to button to edit it.
                        <>
                            <Pencil className="h-4 w-4 mr-2"/>
                            Edit image
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                    !initialData.imageUrl ? ( // image not found.
                        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                            <ImageIcon className="w-10 h-10 text-slate-500"/>
                        </div>
                    ) : ( // image exist in the db.
                        
                        <div className="relative aspect-video mt-2">
                            <Image 
                                alt="upload"
                                fill
                                className="object-cover rounded-md"
                                src={initialData?.imageUrl}
                            />
                        </div>
                    )
            )}
            {isEditing && ( // changing the image.
               <div>
                <FileUpload 
                    endpoint="courseImage"
                    onChange={(url) => {
                        if (url)
                        {
                            onSubmit({ imageUrl: url})
                        }
                    }}
                />
                <div className="text-xs text-muted-foreground mt-4">
                    16:9 aspect ration recommended
                </div>
               </div>
            )}
        </div>
    );
}