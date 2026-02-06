"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { getSites, DEMO_INSPECTIONS } from "@/lib/mockData";
import {
  Building2,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type UploadStatus = "idle" | "uploading" | "analyzing" | "complete" | "error";

interface PhotoUpload {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "uploaded" | "analyzing" | "complete" | "error";
}

export default function NewInspectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedSiteId = searchParams.get("siteId");

  const [selectedSite, setSelectedSite] = useState<string | null>(preselectedSiteId);
  const [photos, setPhotos] = useState<PhotoUpload[]>([]);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

  const sites = getSites("active");

  // Handle drag events
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

  // Process selected files
  const processFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const imageFiles = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, 100);

    const newPhotos: PhotoUpload[] = imageFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      status: "pending",
    }));

    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 100));
  }, []);

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
      e.target.value = "";
    },
    [processFiles]
  );

  const removePhoto = useCallback((index: number) => {
    setPhotos((prev) => {
      const newPhotos = [...prev];
      URL.revokeObjectURL(newPhotos[index].preview);
      newPhotos.splice(index, 1);
      return newPhotos;
    });
  }, []);

  const clearAllPhotos = useCallback(() => {
    photos.forEach((p) => URL.revokeObjectURL(p.preview));
    setPhotos([]);
  }, [photos]);

  // Simulate upload and analyze
  const handleStartAnalysis = async () => {
    if (!selectedSite || photos.length === 0) return;

    setUploadStatus("uploading");
    setUploadProgress({ current: 0, total: photos.length });

    // Simulate upload progress
    for (let i = 0; i < photos.length; i++) {
      setPhotos((prev) => {
        const updated = [...prev];
        updated[i] = { ...updated[i], status: "uploading" };
        return updated;
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      setPhotos((prev) => {
        const updated = [...prev];
        updated[i] = { ...updated[i], status: "uploaded" };
        return updated;
      });

      setUploadProgress({ current: i + 1, total: photos.length });
    }

    // Simulate AI analysis
    setUploadStatus("analyzing");

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setUploadStatus("complete");

    // Redirect to the "reviewing" demo inspection
    setTimeout(() => {
      router.push(`/inspect/inspection_reviewing`);
    }, 1000);
  };

  const selectedSiteData = sites?.find((s) => s._id === selectedSite);
  const canStart = selectedSite && photos.length > 0 && uploadStatus === "idle";

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Safety Inspection</h1>
          <p className="text-gray-500 mt-1">
            Upload your job site photos and let AI analyze them for safety compliance
          </p>
        </div>

        {/* Demo banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 text-white flex items-center gap-3">
          <Sparkles className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">
            <strong>Demo Mode:</strong> Upload any photos to see the workflow. After simulated analysis,
            you'll be redirected to the review page with pre-populated demo findings.
          </p>
        </div>

        {/* Progress indicator when uploading/analyzing */}
        {uploadStatus !== "idle" && (
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-4">
              {uploadStatus === "uploading" && (
                <>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Upload className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg">Uploading photos...</p>
                    <p className="text-white/80 text-sm">
                      {uploadProgress.current} of {uploadProgress.total} uploaded
                    </p>
                    <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white transition-all duration-300"
                        style={{
                          width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
              {uploadStatus === "analyzing" && (
                <>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg">AI is analyzing your photos...</p>
                    <p className="text-white/80 text-sm">
                      Detecting safety hazards, PPE compliance, and more
                    </p>
                    <div className="mt-2 flex gap-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-2 w-8 bg-white/40 rounded-full animate-pulse"
                          style={{ animationDelay: `${i * 150}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
              {uploadStatus === "complete" && (
                <>
                  <div className="w-12 h-12 rounded-full bg-green-500/40 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg">Analysis complete!</p>
                    <p className="text-white/80 text-sm">Redirecting to review...</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 1: Select Site */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                selectedSite
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-900 text-white"
              )}
            >
              {selectedSite ? <CheckCircle2 className="w-5 h-5" /> : "1"}
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Select Job Site</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {sites.map((site) => (
              <button
                key={site._id}
                onClick={() => setSelectedSite(site._id)}
                disabled={uploadStatus !== "idle"}
                className={cn(
                  "p-4 rounded-xl border text-left transition-all",
                  uploadStatus !== "idle" && "opacity-50 cursor-not-allowed",
                  selectedSite === site._id
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      selectedSite === site._id ? "bg-blue-100" : "bg-gray-100"
                    )}
                  >
                    <Building2
                      className={cn(
                        "w-5 h-5",
                        selectedSite === site._id ? "text-blue-600" : "text-gray-500"
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "font-medium",
                        selectedSite === site._id ? "text-blue-900" : "text-gray-900"
                      )}
                    >
                      {site.name}
                    </p>
                    {site.address && (
                      <p className="text-sm text-gray-500 truncate mt-0.5">
                        {site.address}
                      </p>
                    )}
                  </div>
                  {selectedSite === site._id && (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Upload Photos */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                photos.length > 0
                  ? "bg-green-100 text-green-700"
                  : selectedSite
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-gray-500"
              )}
            >
              {photos.length > 0 ? <CheckCircle2 className="w-5 h-5" /> : "2"}
            </div>
            <h2
              className={cn(
                "text-lg font-semibold",
                selectedSite ? "text-gray-900" : "text-gray-400"
              )}
            >
              Upload Photos
            </h2>
            {photos.length > 0 && (
              <span className="ml-auto text-sm text-gray-500">
                {photos.length} photo{photos.length !== 1 ? "s" : ""} selected
              </span>
            )}
          </div>

          {/* Drop zone */}
          <div
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              "relative border-2 border-dashed rounded-xl p-8 transition-all",
              !selectedSite && "opacity-50 pointer-events-none",
              uploadStatus !== "idle" && "opacity-50 pointer-events-none",
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            )}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic"
              multiple
              onChange={handleFileInput}
              disabled={!selectedSite || uploadStatus !== "idle"}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
                  isDragging ? "bg-blue-100" : "bg-gray-100"
                )}
              >
                <Camera
                  className={cn(
                    "w-8 h-8 transition-colors",
                    isDragging ? "text-blue-600" : "text-gray-400"
                  )}
                />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {isDragging ? "Drop photos here" : "Drop job site photos here"}
                </p>
                <p className="text-sm text-gray-500 mt-1">or click to browse</p>
              </div>
              <p className="text-xs text-gray-400">
                PNG, JPG, WebP, HEIC - Up to 100 photos - 10MB each
              </p>
            </div>
          </div>

          {/* Photo preview grid */}
          {photos.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">
                  {photos.length} photo{photos.length !== 1 ? "s" : ""} ready
                </p>
                {uploadStatus === "idle" && (
                  <button
                    onClick={clearAllPhotos}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {photos.map((photo, index) => (
                  <div
                    key={`${photo.file.name}-${index}`}
                    className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
                  >
                    <img
                      src={photo.preview}
                      alt={photo.file.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Status overlay */}
                    {photo.status !== "pending" && (
                      <div
                        className={cn(
                          "absolute inset-0 flex items-center justify-center",
                          photo.status === "uploading" && "bg-black/40",
                          photo.status === "uploaded" && "bg-green-500/40",
                          photo.status === "analyzing" && "bg-blue-500/40",
                          photo.status === "complete" && "bg-green-500/40",
                          photo.status === "error" && "bg-red-500/40"
                        )}
                      >
                        {photo.status === "uploaded" && (
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        )}
                      </div>
                    )}
                    {/* Remove button */}
                    {uploadStatus === "idle" && (
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Start Analysis Button */}
        {photos.length > 0 && uploadStatus === "idle" && (
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Ready to analyze</h3>
                <p className="text-white/70 mt-1 text-sm">
                  {selectedSiteData?.name} - {photos.length} photo{photos.length !== 1 ? "s" : ""}
                </p>
                <p className="text-white/50 mt-2 text-xs">
                  AI will scan each photo for safety hazards, PPE compliance, fall protection, and more
                </p>
              </div>
            </div>
            <button
              onClick={handleStartAnalysis}
              disabled={!canStart}
              className={cn(
                "w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors",
                canStart
                  ? "bg-white text-gray-900 hover:bg-gray-100"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              )}
            >
              <Sparkles className="w-5 h-5" />
              Start AI Analysis
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Empty state prompt */}
        {photos.length === 0 && selectedSite && uploadStatus === "idle" && (
          <div className="text-center py-8 text-gray-500">
            <Camera className="w-12 h-12 mx-auto text-gray-300" />
            <p className="mt-3 font-medium">Upload your job site photos</p>
            <p className="text-sm mt-1">
              Drag and drop up to 100 photos, or click to browse
            </p>
          </div>
        )}

        {/* Quick links */}
        <div className="border-t pt-6">
          <p className="text-sm text-gray-500 mb-3">Or try a demo:</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/inspect/inspection_reviewing"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              <Camera className="w-4 h-4" />
              View Review Workflow
            </Link>
            <Link
              href="/inspect/inspection_completed/report"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              View Sample Report
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
