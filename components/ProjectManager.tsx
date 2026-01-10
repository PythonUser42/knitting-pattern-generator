'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { SavedProject } from '@/lib/types';
import {
  getSavedProjects,
  saveProject,
  deleteProject,
  generateProjectId,
  fileToDataUrl,
  getStorageInfo,
} from '@/lib/projectStorage';

interface ProjectManagerProps {
  onProjectLoaded?: () => void;
}

export default function ProjectManager({ onProjectLoaded }: ProjectManagerProps) {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [storageInfo, setStorageInfo] = useState({ used: 0, available: 0, projectCount: 0 });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const {
    uploadedImage,
    imageDataUrl,
    chart,
    selectedGarment,
    selectedSize,
    selectedGauge,
    customGauge,
    customMeasurements,
    pattern,
    currentProjectId,
    currentProjectName,
    setCurrentProjectId,
    setCurrentProjectName,
    setImageDataUrl,
    loadProject,
    reset,
  } = useStore();

  useEffect(() => {
    setProjects(getSavedProjects());
    setStorageInfo(getStorageInfo());
  }, []);

  const refreshProjects = () => {
    setProjects(getSavedProjects());
    setStorageInfo(getStorageInfo());
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let dataUrl = imageDataUrl;

      // Convert uploaded image to data URL if needed
      if (uploadedImage && !dataUrl) {
        dataUrl = await fileToDataUrl(uploadedImage);
        setImageDataUrl(dataUrl);
      }

      const now = new Date();
      const projectId = currentProjectId || generateProjectId();

      const project: SavedProject = {
        id: projectId,
        name: currentProjectName,
        createdAt: currentProjectId ? projects.find(p => p.id === currentProjectId)?.createdAt || now : now,
        updatedAt: now,
        imageDataUrl: dataUrl,
        chart,
        selectedGarment,
        selectedSize,
        selectedGauge,
        customGauge,
        customMeasurements,
        pattern,
      };

      saveProject(project);
      setCurrentProjectId(projectId);
      refreshProjects();
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project. Storage may be full.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoad = (project: SavedProject) => {
    loadProject(project);
    setIsOpen(false);
    onProjectLoaded?.();
  };

  const handleDelete = (projectId: string) => {
    deleteProject(projectId);
    if (currentProjectId === projectId) {
      reset();
    }
    setConfirmDelete(null);
    refreshProjects();
  };

  const handleNewProject = () => {
    reset();
    setIsOpen(false);
    onProjectLoaded?.();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const hasUnsavedChanges = !currentProjectId && (chart || pattern);

  return (
    <div className="relative">
      {/* Top Bar */}
      <div className="flex items-center gap-3 mb-4">
        {/* Project Name */}
        <div className="flex items-center gap-2 flex-1">
          {editingName ? (
            <input
              type="text"
              value={currentProjectName}
              onChange={(e) => setCurrentProjectName(e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingName(false)}
              className="px-2 py-1 border border-blue-500 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 flex items-center gap-1"
              title="Click to rename project"
            >
              {currentProjectName}
              <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
          {hasUnsavedChanges && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Unsaved</span>
          )}
        </div>

        {/* Action Buttons */}
        <button
          onClick={handleSave}
          disabled={isSaving || (!chart && !pattern)}
          className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save
            </>
          )}
        </button>

        <button
          onClick={() => setIsOpen(true)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          Projects ({projects.length})
        </button>
      </div>

      {/* Projects Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">My Projects</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Storage Info */}
            <div className="px-4 py-2 bg-gray-50 border-b text-sm text-gray-600">
              Storage: {formatBytes(storageInfo.used)} / 5 MB used
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: `${(storageInfo.used / (5 * 1024 * 1024)) * 100}%` }}
                />
              </div>
            </div>

            {/* Project List */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* New Project Button */}
              <button
                onClick={handleNewProject}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 mb-4"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-gray-600">New Project</span>
              </button>

              {projects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No saved projects yet.</p>
                  <p className="text-sm mt-1">Your projects will appear here after you save them.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .map((project) => (
                      <div
                        key={project.id}
                        className={`p-4 border rounded-lg hover:border-blue-300 transition-colors ${
                          currentProjectId === project.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Thumbnail */}
                          <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                            {project.imageDataUrl ? (
                              <img
                                src={project.imageDataUrl}
                                alt={project.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Project Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">{project.name}</h3>
                            <div className="text-sm text-gray-500 mt-1">
                              <span className="capitalize">{project.selectedGarment}</span>
                              {' • '}
                              <span>{project.selectedSize}</span>
                              {' • '}
                              <span className="capitalize">{project.selectedGauge.yarnWeight}</span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Updated {formatDate(project.updatedAt)}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleLoad(project)}
                              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Open
                            </button>
                            {confirmDelete === project.id ? (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleDelete(project.id)}
                                  className="px-2 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(null)}
                                  className="px-2 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDelete(project.id)}
                                className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 hover:border-red-300 hover:text-red-600"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
