"use client";

import { useState } from "react";
import { use } from "react";
import Link from "next/link";
import { ChecklistReport } from "@/components/report/ChecklistReport";
import { getVisitById, getChecklistSummary, MOCK_PHOTOS, type LegacyPhoto } from "@/lib/mockData";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Download,
  Camera,
  AlertOctagon,
  CheckCircle2,
  X,
  Shield,
} from "lucide-react";

interface VisitPageProps {
  params: Promise<{ id: string }>;
}

export default function VisitDetailPage({ params }: VisitPageProps) {
  const { id } = use(params);
  const visit = getVisitById(id);
  const [selectedPhoto, setSelectedPhoto] = useState<LegacyPhoto | null>(null);

  if (!visit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-medium text-gray-900 mb-2">Visit not found</h1>
          <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const results = visit.checklistResults || [];
  const summary = getChecklistSummary(results);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="border-b bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">{visit.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {visit.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {visit.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(visit.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Camera className="w-4 h-4" />
                  {visit.photoCount} photos
                </span>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-3xl font-semibold tabular-nums">{summary.complianceRate}%</div>
                <div className="text-sm text-gray-500">compliance</div>
              </div>
              {summary.criticalFails > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                  <AlertOctagon className="w-5 h-5 text-red-500" />
                  <div>
                    <div className="text-sm font-semibold text-red-700">
                      {summary.criticalFails} Critical
                    </div>
                    <div className="text-xs text-red-600">Requires action</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checklist Report */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Inspection Checklist</h2>
              <p className="text-sm text-gray-500">
                ASME A17.1 compliance items with photo evidence
              </p>
            </div>
            <ChecklistReport
              results={results}
              photos={MOCK_PHOTOS}
              onPhotoClick={setSelectedPhoto}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Photos panel */}
            <div className="bg-gray-50 rounded-xl p-4 border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Uploaded Photos</h3>
                <span className="text-xs text-gray-500">{MOCK_PHOTOS.length} total</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {MOCK_PHOTOS.map((photo) => (
                  <button
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo)}
                    className="aspect-square rounded overflow-hidden bg-gray-200 hover:ring-2 hover:ring-blue-500 transition-all"
                  >
                    <img
                      src={photo.url}
                      alt={photo.filename}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Summary */}
            <div className="bg-gray-50 rounded-xl p-4 border">
              <h3 className="font-medium text-gray-900 mb-4">Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Pass
                  </span>
                  <span className="font-medium">{summary.pass}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-gray-600">
                    <AlertOctagon className="w-4 h-4 text-amber-500" />
                    Warning
                  </span>
                  <span className="font-medium">{summary.warning}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-gray-600">
                    <X className="w-4 h-4 text-red-500" />
                    Fail
                  </span>
                  <span className="font-medium text-red-600">{summary.fail}</span>
                </div>
                <div className="pt-3 border-t mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total items</span>
                    <span className="font-medium">{summary.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Photo modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-white rounded-xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="text-sm font-medium text-gray-700">{selectedPhoto.filename}</span>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.filename}
                className="w-full h-auto"
              />
            </div>
            <div className="px-4 py-3 border-t bg-gray-50 text-xs text-gray-500">
              Captured {selectedPhoto.timestamp}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
