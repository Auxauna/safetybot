"use client";

import { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { Upload, Image as ImageIcon, X } from "lucide-react";

interface FileWithPreview extends File {
  preview?: string;
}

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  className?: string;
}

export function DropZone({ onFilesSelected, maxFiles = 50, className }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const imageFiles = Array.from(files)
        .filter((file) => file.type.startsWith("image/"))
        .slice(0, maxFiles);

      const filesWithPreviews = imageFiles.map((file) => {
        const fileWithPreview = file as FileWithPreview;
        fileWithPreview.preview = URL.createObjectURL(file);
        return fileWithPreview;
      });

      setSelectedFiles((prev) => {
        const combined = [...prev, ...filesWithPreviews].slice(0, maxFiles);
        onFilesSelected(combined);
        return combined;
      });
    },
    [maxFiles, onFilesSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      processFiles(e.target.files);
    },
    [processFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      setSelectedFiles((prev) => {
        const newFiles = prev.filter((_, i) => i !== index);
        if (prev[index].preview) {
          URL.revokeObjectURL(prev[index].preview!);
        }
        onFilesSelected(newFiles);
        return newFiles;
      });
    },
    [onFilesSelected]
  );

  const clearAll = useCallback(() => {
    selectedFiles.forEach((file) => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });
    setSelectedFiles([]);
    onFilesSelected([]);
  }, [selectedFiles, onFilesSelected]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop area */}
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-12 transition-all cursor-pointer",
          "flex flex-col items-center justify-center gap-4 text-center",
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
        <div
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
            isDragging ? "bg-blue-100" : "bg-gray-100"
          )}
        >
          <Upload
            className={cn(
              "w-8 h-8 transition-colors",
              isDragging ? "text-blue-600" : "text-gray-400"
            )}
          />
        </div>
        <div>
          <p className="text-lg font-medium text-gray-900">
            {isDragging ? "Drop photos here" : "Drag photos here"}
          </p>
          <p className="text-sm text-gray-500 mt-1">or click to browse</p>
        </div>
        <p className="text-xs text-gray-400">
          PNG, JPG, WebP up to 10MB each • Max {maxFiles} photos
        </p>
      </div>

      {/* Selected files preview */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              {selectedFiles.length} photo{selectedFiles.length !== 1 ? "s" : ""} selected
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
              >
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
