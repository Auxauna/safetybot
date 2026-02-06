"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { getSites, Site } from "@/lib/mockData";
import { formatDistanceToNow } from "@/lib/dateUtils";
import {
  Building2,
  Plus,
  MapPin,
  Phone,
  User,
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function SitesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingSite, setEditingSite] = useState<string | null>(null);

  // Use mock data - in a real app this would come from a database
  const sites = getSites();

  const handleCreate = async (data: {
    name: string;
    address?: string;
    contactName?: string;
    contactPhone?: string;
    notes?: string;
  }) => {
    // Demo mode - just close the form
    console.log("Would create site:", data);
    setShowForm(false);
  };

  const handleUpdate = async (
    id: string,
    data: {
      name?: string;
      address?: string;
      contactName?: string;
      contactPhone?: string;
      notes?: string;
    }
  ) => {
    // Demo mode - just close the form
    console.log("Would update site:", id, data);
    setEditingSite(null);
  };

  const handleDelete = async (id: string) => {
    // Demo mode - show alert
    alert("In demo mode, sites cannot be deleted.");
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sites</h1>
            <p className="text-gray-500 mt-1">
              Manage your job site locations
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Site
          </button>
        </div>

        {/* New Site Form */}
        {showForm && (
          <SiteForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Sites List */}
        {sites.length === 0 ? (
          <SitesEmpty onAdd={() => setShowForm(true)} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sites.map((site) => (
              <SiteCard
                key={site._id}
                site={site}
                isEditing={editingSite === site._id}
                onEdit={() => setEditingSite(site._id)}
                onCancelEdit={() => setEditingSite(null)}
                onUpdate={(data) => handleUpdate(site._id, data)}
                onDelete={() => handleDelete(site._id)}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function SiteForm({
  site,
  onSubmit,
  onCancel,
}: {
  site?: {
    name: string;
    address?: string;
    contactName?: string;
    contactPhone?: string;
    notes?: string;
  };
  onSubmit: (data: {
    name: string;
    address?: string;
    contactName?: string;
    contactPhone?: string;
    notes?: string;
  }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(site?.name || "");
  const [address, setAddress] = useState(site?.address || "");
  const [contactName, setContactName] = useState(site?.contactName || "");
  const [contactPhone, setContactPhone] = useState(site?.contactPhone || "");
  const [notes, setNotes] = useState(site?.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      address: address.trim() || undefined,
      contactName: contactName.trim() || undefined,
      contactPhone: contactPhone.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">
          {site ? "Edit Site" : "New Site"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Site Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Turner HQ Tower"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main St, City, ST"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Name
          </label>
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Site supervisor"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Phone
          </label>
          <input
            type="tel"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="(555) 123-4567"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any special instructions or notes..."
          rows={2}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          {site ? "Save Changes" : "Add Site"}
        </button>
      </div>
    </form>
  );
}

function SiteCard({
  site,
  isEditing,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
}: {
  site: Site;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (data: {
    name?: string;
    address?: string;
    contactName?: string;
    contactPhone?: string;
    notes?: string;
  }) => void;
  onDelete: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  if (isEditing) {
    return (
      <SiteForm
        site={site}
        onSubmit={onUpdate}
        onCancel={onCancelEdit}
      />
    );
  }

  const statusColors = {
    active: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
    inactive: { bg: "bg-gray-100", text: "text-gray-600", icon: Clock },
  };

  const statusStyle = statusColors[site.status] || statusColors.active;

  return (
    <div className="bg-white rounded-xl border p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{site.name}</h3>
            <div
              className={cn(
                "inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded mt-1",
                statusStyle.bg,
                statusStyle.text
              )}
            >
              <statusStyle.icon className="w-3 h-3" />
              {site.status}
            </div>
          </div>
        </div>

        {/* Actions menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg border shadow-lg z-20">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEdit();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        {site.address && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="truncate">{site.address}</span>
          </div>
        )}
        {site.contactName && (
          <div className="flex items-center gap-2 text-gray-600">
            <User className="w-4 h-4 text-gray-400" />
            <span>{site.contactName}</span>
          </div>
        )}
        {site.contactPhone && (
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>{site.contactPhone}</span>
          </div>
        )}
      </div>

      {site.notes && (
        <p className="mt-3 text-sm text-gray-500 line-clamp-2">{site.notes}</p>
      )}

      <div className="mt-4 pt-4 border-t flex items-center justify-between">
        <span className="text-xs text-gray-400">
          Added {formatDistanceToNow(site.createdAt)}
        </span>
        <Link
          href={`/inspect/new?siteId=${site._id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Start Inspection →
        </Link>
      </div>
    </div>
  );
}

function SitesEmpty({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="bg-white rounded-xl border p-12 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <Building2 className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">No sites yet</h3>
      <p className="text-gray-500 mt-1 mb-6">
        Add your first job site to start conducting inspections
      </p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Site
      </button>
    </div>
  );
}
