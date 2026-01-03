"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
  disabled?: boolean;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  className,
  disabled = false,
  label = "Upload Photo",
}: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      setIsLoading(true);
      const imageUrl = await uploadToCloudinary(file);
      onChange(imageUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled || isLoading}
        className="hidden"
      />

      <div
        className={`relative w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-gray-400 transition group overflow-hidden ${
          disabled || isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => !disabled && !isLoading && fileInputRef.current?.click()}
      >
        {value ? (
          <>
            <Image src={value} alt="Profile" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <span className="text-white text-sm font-medium">Change</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <svg
                  className="w-8 h-8 mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-xs">{label}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
