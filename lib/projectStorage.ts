// localStorage utilities for saving and loading projects
import { SavedProject } from './types';

const STORAGE_KEY = 'knitting-pattern-projects';

export function getSavedProjects(): SavedProject[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const projects = JSON.parse(stored) as SavedProject[];
    // Convert date strings back to Date objects
    return projects.map(p => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
      pattern: p.pattern ? {
        ...p.pattern,
        createdAt: new Date(p.pattern.createdAt),
      } : null,
    }));
  } catch (error) {
    console.error('Failed to load projects from localStorage:', error);
    return [];
  }
}

export function saveProject(project: SavedProject): void {
  if (typeof window === 'undefined') return;

  try {
    const projects = getSavedProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);

    if (existingIndex >= 0) {
      projects[existingIndex] = project;
    } else {
      projects.push(project);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to save project to localStorage:', error);
    throw new Error('Failed to save project. Storage may be full.');
  }
}

export function deleteProject(projectId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const projects = getSavedProjects();
    const filtered = projects.filter(p => p.id !== projectId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete project from localStorage:', error);
    throw new Error('Failed to delete project.');
  }
}

export function getProject(projectId: string): SavedProject | null {
  const projects = getSavedProjects();
  return projects.find(p => p.id === projectId) || null;
}

export function generateProjectId(): string {
  return `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Convert File to base64 data URL
export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Convert base64 data URL back to File (for display purposes)
export function dataUrlToFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

// Get storage usage info
export function getStorageInfo(): { used: number; available: number; projectCount: number } {
  if (typeof window === 'undefined') {
    return { used: 0, available: 5 * 1024 * 1024, projectCount: 0 };
  }

  const projects = getSavedProjects();
  const stored = localStorage.getItem(STORAGE_KEY) || '';
  const usedBytes = new Blob([stored]).size;

  // localStorage typically has 5MB limit
  const totalBytes = 5 * 1024 * 1024;

  return {
    used: usedBytes,
    available: totalBytes - usedBytes,
    projectCount: projects.length,
  };
}
