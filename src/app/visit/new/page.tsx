"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Section } from "@/components/layout/Section";
import { CategoryBadge } from "@/components/layout/Badge";
import { DropZone } from "@/components/upload/DropZone";
import { ArrowRight, Loader2, MapPin, FileText } from "lucide-react";

export default function NewVisitPage() {
  const router = useRouter();
  const [visitName, setVisitName] = useState("");
  const [location, setLocation] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const canSubmit = visitName.trim() && files.length > 0 && !isUploading;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsUploading(true);

    // Simulate upload delay for demo
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In real app: upload to Convex, create visit, trigger analysis
    // For demo: redirect to mock visit
    router.push("/visit/visit-1");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Visit Info Section */}
        <Section number={1} total={2} label="Visit Details" withGrid>
          <div className="py-12 px-6">
            <div className="max-w-xl mx-auto">
              <CategoryBadge className="mb-4">New Safety Visit</CategoryBadge>
              <h1 className="text-3xl font-medium text-gray-900 mb-8">
                Let&apos;s Get Started
              </h1>

              <div className="space-y-6">
                {/* Visit Name */}
                <div>
                  <label htmlFor="visitName" className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-1.5" />
                    Visit Name *
                  </label>
                  <input
                    type="text"
                    id="visitName"
                    value={visitName}
                    onChange={(e) => setVisitName(e.target.value)}
                    placeholder="Vegas Blitz - Jan 2026"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    Give it a name you&apos;ll recognize later
                  </p>
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1.5" />
                    Location (optional)
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Las Vegas, NV"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Photo Upload Section */}
        <Section number={2} total={2} label="Upload Photos">
          <div className="py-12 px-6">
            <div className="max-w-xl mx-auto">
              <h2 className="text-xl font-medium text-gray-900 mb-2">
                Add Your Photos
              </h2>
              <p className="text-gray-500 mb-6">
                Drag all your job site photos here. We&apos;ll analyze each one and write up what we see.
              </p>

              <DropZone
                onFilesSelected={setFiles}
                maxFiles={50}
              />

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white text-lg font-medium rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Uploading & Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze {files.length > 0 ? `${files.length} Photos` : "Photos"}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                {!visitName.trim() && files.length > 0 && (
                  <p className="text-center text-sm text-amber-600 mt-2">
                    Please enter a visit name above
                  </p>
                )}
              </div>

              {/* Info */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  What happens next?
                </h4>
                <p className="text-sm text-blue-700">
                  Our AI will look at each photo and identify safety observations -
                  just like you would, but in seconds instead of hours. You&apos;ll be able
                  to review and edit everything before finalizing.
                </p>
              </div>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
