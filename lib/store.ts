// Global state management with Zustand
import { create } from 'zustand';
import { StitchChart, Pattern, Gauge, GarmentType, Size, YarnColor, CustomGauge, CustomMeasurements, SavedProject } from './types';
import { Language } from './translations';

interface AppState {
  // Welcome screen
  hasSeenWelcome: boolean;

  // Language
  language: Language;

  // Image and chart
  uploadedImage: File | null;
  imageDataUrl: string | null;
  chart: StitchChart | null;
  validation: { isValid: boolean; score: number; warnings: string[]; suggestions: string[] } | null;

  // Customization
  selectedGarment: GarmentType;
  selectedSize: Size | string;
  selectedGauge: Gauge;
  customGauge: CustomGauge | null;
  customMeasurements: CustomMeasurements | null;
  useCustomMeasurements: boolean;
  customColors: Map<string, YarnColor>;

  // Generated pattern
  pattern: Pattern | null;

  // Project management
  currentProjectId: string | null;
  currentProjectName: string;

  // Progress tracking
  completedRows: number[];
  zoomLevel: number;

  // Chart editing
  editMode: boolean;
  selectedEditColor: YarnColor | null;

  // Actions
  setHasSeenWelcome: (seen: boolean) => void;
  setLanguage: (lang: Language) => void;
  setUploadedImage: (file: File | null) => void;
  setImageDataUrl: (dataUrl: string | null) => void;
  setChart: (chart: StitchChart | null) => void;
  setValidation: (validation: any) => void;
  setSelectedGarment: (garment: GarmentType) => void;
  setSelectedSize: (size: Size | string) => void;
  setSelectedGauge: (gauge: Gauge) => void;
  setCustomGauge: (customGauge: CustomGauge | null) => void;
  setCustomMeasurements: (measurements: CustomMeasurements | null) => void;
  setUseCustomMeasurements: (use: boolean) => void;
  setCustomColor: (colorId: string, color: YarnColor) => void;
  setPattern: (pattern: Pattern | null) => void;
  setCurrentProjectId: (id: string | null) => void;
  setCurrentProjectName: (name: string) => void;
  setCompletedRows: (rows: number[]) => void;
  toggleRowComplete: (row: number) => void;
  resetProgress: () => void;
  setZoomLevel: (level: number) => void;
  setEditMode: (mode: boolean) => void;
  setSelectedEditColor: (color: YarnColor | null) => void;
  updateChartCell: (x: number, y: number, colorId: string) => void;
  reset: () => void;
  loadProject: (project: SavedProject) => void;
}

const defaultGauge: Gauge = {
  stitchesPerInch: 4.5,
  rowsPerInch: 6,
  yarnWeight: 'worsted',
};

// Check localStorage for welcome state
const getInitialWelcomeState = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('hasSeenWelcome') === 'true';
  }
  return false;
};

// Get initial language from localStorage or default to German
const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('language');
    if (saved === 'en' || saved === 'de') {
      return saved;
    }
  }
  return 'de'; // Default to German
};

export const useStore = create<AppState>((set) => ({
  hasSeenWelcome: false, // Will be updated on mount
  language: 'de', // Default to German, will be updated on mount
  uploadedImage: null,
  imageDataUrl: null,
  chart: null,
  validation: null,
  selectedGarment: 'beanie',
  selectedSize: 'M',
  selectedGauge: defaultGauge,
  customGauge: null,
  customMeasurements: null,
  useCustomMeasurements: false,
  customColors: new Map(),
  pattern: null,
  currentProjectId: null,
  currentProjectName: 'Untitled Project',
  completedRows: [],
  zoomLevel: 100,
  editMode: false,
  selectedEditColor: null,

  setHasSeenWelcome: (seen) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      localStorage.setItem('hasSeenWelcome', seen.toString());
    }
    set({ hasSeenWelcome: seen });
  },
  setLanguage: (lang) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
    set({ language: lang });
  },
  setUploadedImage: (file) => set({ uploadedImage: file }),
  setImageDataUrl: (dataUrl) => set({ imageDataUrl: dataUrl }),
  setChart: (chart) => set({ chart }),
  setValidation: (validation) => set({ validation }),
  setSelectedGarment: (garment) => set({ selectedGarment: garment }),
  setSelectedSize: (size) => set({ selectedSize: size }),
  setSelectedGauge: (gauge) => set({ selectedGauge: gauge }),
  setCustomGauge: (customGauge) => set({ customGauge }),
  setCustomMeasurements: (measurements) => set({ customMeasurements: measurements }),
  setUseCustomMeasurements: (use) => set({ useCustomMeasurements: use }),
  setCustomColor: (colorId, color) =>
    set((state) => {
      const newColors = new Map(state.customColors);
      newColors.set(colorId, color);
      return { customColors: newColors };
    }),
  setPattern: (pattern) => set({ pattern }),
  setCurrentProjectId: (id) => set({ currentProjectId: id }),
  setCurrentProjectName: (name) => set({ currentProjectName: name }),
  setCompletedRows: (rows) => set({ completedRows: rows }),
  toggleRowComplete: (row) => set((state) => {
    const completed = new Set(state.completedRows);
    if (completed.has(row)) {
      completed.delete(row);
    } else {
      completed.add(row);
    }
    return { completedRows: Array.from(completed) };
  }),
  resetProgress: () => set({ completedRows: [] }),
  setZoomLevel: (level) => set({ zoomLevel: Math.max(50, Math.min(200, level)) }),
  setEditMode: (mode) => set({ editMode: mode, selectedEditColor: mode ? null : null }),
  setSelectedEditColor: (color) => set({ selectedEditColor: color }),
  updateChartCell: (x, y, colorId) =>
    set((state) => {
      if (!state.chart) return {};
      // Deep clone the grid to trigger re-render
      const newGrid = state.chart.grid.map(row => [...row]);
      newGrid[y][x] = colorId;
      return {
        chart: {
          ...state.chart,
          grid: newGrid,
        },
      };
    }),
  reset: () =>
    set({
      uploadedImage: null,
      imageDataUrl: null,
      chart: null,
      validation: null,
      selectedGarment: 'beanie',
      selectedSize: 'M',
      selectedGauge: defaultGauge,
      customGauge: null,
      customMeasurements: null,
      useCustomMeasurements: false,
      customColors: new Map(),
      pattern: null,
      currentProjectId: null,
      currentProjectName: 'Untitled Project',
      completedRows: [],
      zoomLevel: 100,
      editMode: false,
      selectedEditColor: null,
    }),
  loadProject: (project) =>
    set({
      imageDataUrl: project.imageDataUrl,
      chart: project.chart,
      selectedGarment: project.selectedGarment,
      selectedSize: project.selectedSize,
      selectedGauge: project.selectedGauge,
      customGauge: project.customGauge,
      customMeasurements: project.customMeasurements,
      useCustomMeasurements: project.customMeasurements !== null,
      pattern: project.pattern,
      currentProjectId: project.id,
      currentProjectName: project.name,
      uploadedImage: null, // File objects can't be serialized, will be null on load
      customColors: new Map(),
      validation: null,
      completedRows: [],
      zoomLevel: 100,
      editMode: false,
      selectedEditColor: null,
    }),
}));
