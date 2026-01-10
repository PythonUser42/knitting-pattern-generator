// Global state management with Zustand
import { create } from 'zustand';
import { StitchChart, Pattern, Gauge, GarmentType, Size, YarnColor, CustomGauge, CustomMeasurements, SavedProject } from './types';

interface AppState {
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

  // Actions
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
  reset: () => void;
  loadProject: (project: SavedProject) => void;
}

const defaultGauge: Gauge = {
  stitchesPerInch: 4.5,
  rowsPerInch: 6,
  yarnWeight: 'worsted',
};

export const useStore = create<AppState>((set) => ({
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
    }),
}));
