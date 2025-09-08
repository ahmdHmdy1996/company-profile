import React, { useState } from "react";
import { Trash2, Edit, Eye, Calendar } from "lucide-react";
import { LoadingSpinner } from "./LoadingComponents";

const SavedProfilesModal = ({
  isOpen,
  onClose,
  profiles,
  onLoadProfile,
  onDeleteProfile,
  loading = false,
  error = null,
}) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (profileId) => {
    if (!confirm("Are you sure you want to delete this profile?")) return;

    setDeletingId(profileId);
    try {
      await onDeleteProfile(profileId);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Saved Profiles</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {loading && (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && profiles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                No saved profiles yet
              </p>
              <p className="text-gray-400">
                Create and save your first company profile to see it here.
              </p>
            </div>
          )}

          {!loading && !error && profiles.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900 truncate flex-1">
                      {profile.name || "Untitled Profile"}
                    </h3>
                    <div className="flex space-x-1 ml-2">
                      <button
                        onClick={() => onLoadProfile(profile.id)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Load Profile"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(profile.id)}
                        disabled={deletingId === profile.id}
                        className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                        title="Delete Profile"
                      >
                        {deletingId === profile.id ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {profile.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {profile.description}
                    </p>
                  )}

                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar size={12} className="mr-1" />
                    <span>
                      {profile.updated_at
                        ? `Updated ${formatDate(profile.updated_at)}`
                        : `Created ${formatDate(profile.created_at)}`}
                    </span>
                  </div>

                  {profile.template_id && (
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {profile.template_id}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedProfilesModal;
