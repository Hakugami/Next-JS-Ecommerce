"use client";

import * as React from "react";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "./button";

interface ImageUploadProps {
  value: string | null;
  disabled?: boolean;
  onChange: (value: string | null) => void;
  onRemove: () => void;
}

export function ImageUpload({ 
  value, 
  onChange, 
  onRemove, 
  disabled 
}: ImageUploadProps) {
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string' && result.startsWith('data:image')) {
          onChange(result);
        }
      };
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(["image/*"]),
    maxFiles: 1,
    maxSize: 4 * 1024 * 1024, // 4MB
    disabled,
  });

  const isValidImage = React.useMemo(() => {
    if (!value || value === "") return false;
    return value.startsWith("data:image") || value.startsWith("http");
  }, [value]);

  const imageUrl = React.useMemo(() => {
    if (!value || value === "") return undefined;
    return isValidImage ? value : undefined;
  }, [value, isValidImage]);

  return (
    <div className="space-y-4 w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-4 hover:bg-accent/50 transition
          ${isDragActive ? "border-primary" : "border-border"}
          ${isValidImage ? "hidden" : "flex flex-col items-center justify-center"}
          ${disabled ? "opacity-50 pointer-events-none" : ""}
        `}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-sm text-muted-foreground">Drop the image here</p>
        ) : (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Drag & drop an image here, or click to select
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Maximum file size: 4MB
            </p>
          </div>
        )}
      </div>
      {imageUrl && (
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <div className="absolute top-2 right-2 z-10">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={onRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Image
            src={imageUrl}
            alt="Uploaded image"
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
    </div>
  );
}
