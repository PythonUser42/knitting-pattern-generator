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
      {/* Compact Top Bar - Fixed Heights */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '32px' }}>
        {/* Project Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: 0 }}>
          {editingName ? (
            <input
              type="text"
              value={currentProjectName}
              onChange={(e) => setCurrentProjectName(e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingName(false)}
              style={{
                padding: '4px 8px',
                fontSize: '13px',
                width: '160px',
                border: '2px solid var(--color-primary)',
                borderRadius: '6px',
                background: 'var(--color-background)',
                outline: 'none',
              }}
              autoFocus
            />
          ) : (
            <button
              onClick={() => setEditingName(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--color-text)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
              title="Click to rename"
            >
              <svg style={{ width: '14px', height: '14px', color: 'var(--color-text-muted)', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentProjectName}</span>
            </button>
          )}
          {hasUnsavedChanges && (
            <span
              style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: 'var(--color-background-secondary)',
                color: 'var(--color-accent)',
                border: '1px solid var(--color-card-border)',
                flexShrink: 0,
              }}
            >
              unsaved
            </span>
          )}
        </div>

        {/* Compact Action Buttons */}
        <button
          onClick={handleSave}
          disabled={isSaving || (!chart && !pattern)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 600,
            borderRadius: '6px',
            border: 'none',
            cursor: (!chart && !pattern) ? 'not-allowed' : 'pointer',
            background: (!chart && !pattern) ? 'var(--color-background-secondary)' : 'var(--color-primary)',
            color: (!chart && !pattern) ? 'var(--color-text-muted)' : 'var(--color-button-text)',
            opacity: isSaving ? 0.7 : 1,
            transition: 'all 0.2s',
          }}
        >
          <svg style={{ width: '12px', height: '12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Save
        </button>

        <button
          onClick={() => setIsOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 10px',
            fontSize: '12px',
            fontWeight: 600,
            borderRadius: '6px',
            border: '1px solid var(--color-card-border)',
            cursor: 'pointer',
            background: 'var(--color-background-secondary)',
            color: 'var(--color-text)',
            transition: 'all 0.2s',
          }}
        >
          <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span className="projects-label">Projects</span>
        </button>
      </div>

      {/* Projects Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="max-w-2xl w-full max-h-[80vh] flex flex-col"
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: 'var(--border-radius-lg)',
              boxShadow: 'var(--shadow-hover)',
            }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between p-4"
              style={{ borderBottom: '1px solid var(--color-card-border)' }}
            >
              <h2
                className="text-xl font-semibold"
                style={{
                  color: 'var(--color-text)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
My Projects
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1"
                style={{
                  backgroundColor: 'var(--color-background-secondary)',
                  borderRadius: 'var(--border-radius)',
                }}
              >
                <svg className="w-6 h-6" style={{ color: 'var(--color-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Storage Info */}
            <div
              className="px-4 py-2 text-sm"
              style={{
                backgroundColor: 'var(--color-background-secondary)',
                color: 'var(--color-text-muted)',
                borderBottom: '1px solid var(--color-card-border)',
              }}
            >
              Storage: {formatBytes(storageInfo.used)} / 5 MB used
              <div
                className="w-full h-1.5 mt-1"
                style={{
                  backgroundColor: 'var(--color-card-border)',
                  borderRadius: '9999px',
                }}
              >
                <div
                  className="h-1.5"
                  style={{
                    width: `${(storageInfo.used / (5 * 1024 * 1024)) * 100}%`,
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: '9999px',
                  }}
                />
              </div>
            </div>

            {/* Project List */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* New Project Button */}
              <button
                onClick={handleNewProject}
                className="w-full p-4 border-2 border-dashed flex items-center justify-center gap-2 mb-4 transition-colors"
                style={{
                  borderColor: 'var(--color-card-border)',
                  borderRadius: 'var(--border-radius)',
                }}
              >
                <svg className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  New Project
                </span>
              </button>

              {projects.length === 0 ? (
                <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
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
                        className="p-4 transition-colors"
                        style={{
                          border: currentProjectId === project.id
                            ? '2px solid var(--color-primary)'
                            : '1px solid var(--color-card-border)',
                          borderRadius: 'var(--border-radius)',
                          backgroundColor: currentProjectId === project.id
                            ? 'var(--color-background-secondary)'
                            : 'var(--color-card)',
                        }}
                      >
                        <div className="flex items-start gap-4">
                          {/* Thumbnail */}
                          <div
                            className="w-16 h-16 flex-shrink-0 overflow-hidden flex items-center justify-center"
                            style={{
                              backgroundColor: 'var(--color-background-secondary)',
                              borderRadius: 'var(--border-radius)',
                            }}
                          >
                            {project.imageDataUrl ? (
                              <img
                                src={project.imageDataUrl}
                                alt={project.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <svg className="w-8 h-8" style={{ color: 'var(--color-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>

                          {/* Project Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate" style={{ color: 'var(--color-text)' }}>
                              {project.name}
                            </h3>
                            <div className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                              <span className="capitalize">{project.selectedGarment}</span>
                              {' • '}
                              <span>{project.selectedSize}</span>
                              {' • '}
                              <span className="capitalize">{project.selectedGauge.yarnWeight}</span>
                            </div>
                            <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                              Updated {formatDate(project.updatedAt)}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleLoad(project)}
                              className="btn-primary px-3 py-1.5 text-sm"
                            >
                              Open
                            </button>
                            {confirmDelete === project.id ? (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleDelete(project.id)}
                                  className="px-2 py-1.5 text-sm text-white rounded"
                                  style={{ backgroundColor: 'var(--color-error)' }}
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(null)}
                                  className="btn-secondary px-2 py-1.5 text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDelete(project.id)}
                                className="btn-secondary px-3 py-1.5 text-sm"
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
