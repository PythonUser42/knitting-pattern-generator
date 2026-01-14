export type Language = 'de' | 'en';

export const translations = {
  // App Header & Navigation
  appName: {
    de: 'KnitCraft',
    en: 'KnitCraft',
  },
  patternGenerator: {
    de: 'Muster Generator',
    en: 'Pattern Generator',
  },
  tagline: {
    de: 'Verwandle jedes Bild in ein Strickmuster',
    en: 'Turn any image into a knitting pattern',
  },

  // Steps
  stepUpload: {
    de: 'Hochladen',
    en: 'Upload',
  },
  stepCustomize: {
    de: 'Anpassen',
    en: 'Customize',
  },
  stepPreview: {
    de: 'Vorschau',
    en: 'Preview',
  },

  // Buttons
  back: {
    de: '← Zurück',
    en: '← Back',
  },
  backToSettings: {
    de: '← Zurück zu Einstellungen',
    en: '← Back to settings',
  },
  processImage: {
    de: 'Bild verarbeiten →',
    en: 'Process Image →',
  },
  processing: {
    de: 'Verarbeite...',
    en: 'Processing...',
  },
  generatePattern: {
    de: 'Muster erstellen →',
    en: 'Generate Pattern →',
  },
  generating: {
    de: 'Erstelle...',
    en: 'Generating...',
  },
  downloadPDF: {
    de: 'PDF herunterladen',
    en: 'Download PDF',
  },
  getStarted: {
    de: 'Loslegen',
    en: 'Get Started',
  },
  edit: {
    de: 'Bearbeiten',
    en: 'Edit',
  },
  done: {
    de: 'Fertig',
    en: 'Done',
  },
  copy: {
    de: 'Kopieren',
    en: 'Copy',
  },
  download: {
    de: 'Herunterladen',
    en: 'Download',
  },
  save: {
    de: 'Speichern',
    en: 'Save',
  },
  cancel: {
    de: 'Abbrechen',
    en: 'Cancel',
  },
  confirm: {
    de: 'Bestätigen',
    en: 'Confirm',
  },
  delete: {
    de: 'Löschen',
    en: 'Delete',
  },
  open: {
    de: 'Öffnen',
    en: 'Open',
  },

  // Pattern Ready
  patternReady: {
    de: 'Muster fertig!',
    en: 'Pattern Ready!',
  },
  yourChart: {
    de: 'Dein Diagramm',
    en: 'Your Chart',
  },
  colors: {
    de: 'Farben',
    en: 'Colors',
  },
  yards: {
    de: 'Yards',
    en: 'Yards',
  },
  skeins: {
    de: 'Knäuel',
    en: 'Skeins',
  },
  stitches: {
    de: 'Maschen',
    en: 'stitches',
  },

  // Welcome Screen
  welcomeTitle: {
    de: 'Strickmuster Generator',
    en: 'Knitting Pattern Generator',
  },
  welcomeSubtitle: {
    de: 'Verwandle jedes Bild in ein individuelles Strickmuster',
    en: 'Turn any image into a custom knitting pattern',
  },
  step1Desc: {
    de: 'Wähle ein Bild mit 2-6 Farben. Einfache Designs funktionieren am besten!',
    en: 'Choose an image with 2-6 colors. Simple designs work best!',
  },
  step2Desc: {
    de: 'Wähle Kleidungstyp, Größe und Garnstärke.',
    en: 'Pick your garment type, size, and yarn weight.',
  },
  step3Title: {
    de: 'Stricken!',
    en: 'Knit!',
  },
  step3Desc: {
    de: 'Erhalte dein vollständiges Muster mit Diagramm und Anleitung.',
    en: 'Get your complete pattern with chart and instructions.',
  },
  worksGreatFor: {
    de: 'Perfekt für Mützen, Schals und Pullover',
    en: 'Works great for beanies, scarves, and sweaters',
  },
  freeToUse: {
    de: 'Kostenlos. Kein Konto erforderlich.',
    en: 'Free to use. No account required.',
  },

  // Image Upload
  uploadImageFirst: {
    de: 'Bitte lade zuerst ein Bild hoch',
    en: 'Please upload an image first',
  },
  pleaseUploadImage: {
    de: 'Bitte lade eine Bilddatei hoch',
    en: 'Please upload an image file',
  },
  dropImageHere: {
    de: 'Ziehe dein Bild hierher',
    en: 'Drop your image here',
  },
  browseFiles: {
    de: 'Dateien durchsuchen',
    en: 'browse files',
  },
  supportedFormats: {
    de: 'PNG, JPG, SVG',
    en: 'PNG, JPG, SVG',
  },
  changeImage: {
    de: 'Bild ändern',
    en: 'Change image',
  },
  clickOrDragReplace: {
    de: 'Klicken oder ziehen zum Ersetzen',
    en: 'Click or drag to replace',
  },
  forBestResults: {
    de: 'Für beste Ergebnisse',
    en: 'For best results',
  },
  imageTips: {
    de: 'Verwende einfache Bilder mit 2-6 Farben • Hoher Kontrast funktioniert am besten • Klare Formen sind leichter zu stricken',
    en: 'Use simple images with 2-6 colors • High contrast designs work best • Bold shapes are easier to knit',
  },
  orTrySample: {
    de: 'Oder probiere ein Beispielbild',
    en: 'Or try a sample image',
  },

  // Sample Images
  sampleBunny: {
    de: 'Hase',
    en: 'Bunny',
  },
  samplePenguin: {
    de: 'Pinguin',
    en: 'Penguin',
  },
  sampleCoffee: {
    de: 'Kaffee',
    en: 'Coffee',
  },
  sampleCloud: {
    de: 'Wolke',
    en: 'Cloud',
  },
  sampleGhost: {
    de: 'Geist',
    en: 'Ghost',
  },
  sampleCow: {
    de: 'Kuh',
    en: 'Cow',
  },

  // Customization Panel
  patternSettings: {
    de: 'Muster-Einstellungen',
    en: 'Pattern Settings',
  },
  garmentType: {
    de: 'Kleidungstyp',
    en: 'Garment Type',
  },
  beanie: {
    de: 'Mütze',
    en: 'Beanie',
  },
  beginnerFriendly: {
    de: 'Anfängerfreundlich',
    en: 'Beginner friendly',
  },
  scarf: {
    de: 'Schal',
    en: 'Scarf',
  },
  easyProject: {
    de: 'Einfaches Projekt',
    en: 'Easy project',
  },
  sweater: {
    de: 'Pullover',
    en: 'Sweater',
  },
  advanced: {
    de: 'Fortgeschritten',
    en: 'Advanced',
  },
  size: {
    de: 'Größe',
    en: 'Size',
  },
  yarnWeight: {
    de: 'Garnstärke',
    en: 'Yarn Weight',
  },
  recommended: {
    de: 'Empfohlen',
    en: 'Recommended',
  },
  usingCustomGauge: {
    de: 'Verwendet deine eigenen Maschenprobenwerte',
    en: 'Using your custom gauge values',
  },
  advancedOptions: {
    de: 'Erweiterte Optionen',
    en: 'Advanced Options',
  },

  // Yarn Weights
  fingering: {
    de: 'Fingering (7 M/Zoll)',
    en: 'Fingering (7 sts/inch)',
  },
  sport: {
    de: 'Sport (6 M/Zoll)',
    en: 'Sport (6 sts/inch)',
  },
  dk: {
    de: 'DK (5,5 M/Zoll)',
    en: 'DK (5.5 sts/inch)',
  },
  worsted: {
    de: 'Worsted (4,5 M/Zoll)',
    en: 'Worsted (4.5 sts/inch)',
  },
  aran: {
    de: 'Aran (4 M/Zoll)',
    en: 'Aran (4 sts/inch)',
  },
  bulky: {
    de: 'Bulky (3,5 M/Zoll)',
    en: 'Bulky (3.5 sts/inch)',
  },

  // Sizes
  sizeS: {
    de: 'S',
    en: 'S',
  },
  sizeM: {
    de: 'M',
    en: 'M',
  },
  sizeL: {
    de: 'L',
    en: 'L',
  },
  sizeXS: {
    de: 'XS',
    en: 'XS',
  },
  sizeXL: {
    de: 'XL',
    en: 'XL',
  },
  narrow: {
    de: 'Schmal',
    en: 'narrow',
  },
  standard: {
    de: 'Standard',
    en: 'standard',
  },
  wide: {
    de: 'Breit',
    en: 'wide',
  },

  // Gauge Calculator
  yourGauge: {
    de: 'Deine Maschenprobe',
    en: 'Your Gauge (from swatch)',
  },
  standardGauge: {
    de: 'Standard Maschenprobe',
    en: 'Standard Gauge',
  },
  custom: {
    de: 'Individuell',
    en: 'Custom',
  },
  stitchesPerInch: {
    de: 'Maschen pro Zoll',
    en: 'stitches per inch',
  },
  rowsPerInch: {
    de: 'Reihen pro Zoll',
    en: 'rows per inch',
  },
  resetToStandard: {
    de: 'Auf Standard zurücksetzen',
    en: 'Reset to standard gauge',
  },
  calculateFromSwatch: {
    de: 'Aus Maschenprobe berechnen',
    en: 'Calculate from Swatch',
  },
  howToMeasure: {
    de: 'So misst du deine Maschenprobe:',
    en: 'How to measure your swatch:',
  },
  swatchInstr1: {
    de: 'Stricke eine Probe von mindestens 13 x 13 cm in glatt rechts',
    en: 'Knit a swatch at least 5" x 5" in stockinette',
  },
  swatchInstr2: {
    de: 'Lege sie flach hin ohne zu dehnen',
    en: 'Lay it flat without stretching',
  },
  swatchInstr3: {
    de: 'Zähle Maschen und Reihen in einem gemessenen Abschnitt',
    en: 'Count stitches and rows in a measured section',
  },
  swatchInstr4: {
    de: 'Gib deine Messungen unten ein',
    en: 'Enter your measurements below',
  },
  stitchesCounted: {
    de: 'Gezählte Maschen',
    en: 'Stitches counted',
  },
  overWidth: {
    de: 'Über Breite (Zoll)',
    en: 'Over width (inches)',
  },
  rowsCounted: {
    de: 'Gezählte Reihen',
    en: 'Rows counted',
  },
  overHeight: {
    de: 'Über Höhe (Zoll)',
    en: 'Over height (inches)',
  },
  calculatedGauge: {
    de: 'Deine berechnete Maschenprobe:',
    en: 'Your calculated gauge:',
  },
  applyMyGauge: {
    de: 'Meine Maschenprobe anwenden',
    en: 'Apply My Gauge',
  },

  // Custom Sizing
  customSizingRequiresGauge: {
    de: 'Individuelle Größen erfordern eine Maschenprobe.',
    en: 'Custom sizing requires gauge input.',
  },
  enterSwatchMeasurements: {
    de: 'Bitte gib oben deine Maschenprobenwerte ein, um individuelle Größen zu aktivieren.',
    en: 'Please enter your swatch measurements above to enable custom sizing.',
  },
  customSizing: {
    de: 'Individuelle Größen',
    en: 'Custom Sizing',
  },
  customSizingWarning: {
    de: 'Hinweis: Individuelle Größen erhöhen das Risiko von Passformproblemen. Stricke immer eine Maschenprobe und miss sorgfältig.',
    en: 'Note: Custom sizing increases the chance of fit issues. Always knit a gauge swatch and measure carefully.',
  },
  fixErrorsAbove: {
    de: 'Bitte behebe die Fehler oben, bevor du dein Muster erstellst.',
    en: 'Please fix the errors above before generating your pattern.',
  },
  resetToStandardSize: {
    de: 'Auf Standardgröße zurücksetzen',
    en: 'Reset to Standard Size',
  },

  // Custom Sizing Labels - Beanie
  headCircumference: {
    de: 'Kopfumfang',
    en: 'Head Circumference',
  },
  hatHeight: {
    de: 'Mützenhöhe',
    en: 'Hat Height',
  },
  brimDepth: {
    de: 'Bundtiefe',
    en: 'Brim Depth',
  },
  headCircumferenceHint: {
    de: 'Miss um den Kopf, wo die Mütze sitzen wird',
    en: 'Measure around the head where the hat will sit',
  },
  hatHeightHint: {
    de: 'Vom Bundrand bis zur Kopfspitze',
    en: 'From brim edge to top of head',
  },
  brimDepthHint: {
    de: 'Wie viel Bund umgeschlagen werden soll',
    en: 'How much brim to fold up',
  },

  // Custom Sizing Labels - Scarf
  width: {
    de: 'Breite',
    en: 'Width',
  },
  length: {
    de: 'Länge',
    en: 'Length',
  },
  widthHint: {
    de: 'Wie breit der Schal sein wird',
    en: 'How wide the scarf will be',
  },
  lengthHint: {
    de: 'Gesamtlänge des fertigen Schals',
    en: 'Total length of finished scarf',
  },

  // Custom Sizing Labels - Sweater
  chest: {
    de: 'Brustumfang',
    en: 'Chest',
  },
  bodyLength: {
    de: 'Körperlänge',
    en: 'Body Length',
  },
  armholeDepth: {
    de: 'Armausschnitttiefe',
    en: 'Armhole Depth',
  },
  sleeveLength: {
    de: 'Ärmellänge',
    en: 'Sleeve Length',
  },
  cuffWidth: {
    de: 'Bündchenbreite',
    en: 'Cuff Width',
  },
  upperArm: {
    de: 'Oberarm',
    en: 'Upper Arm',
  },
  chestHint: {
    de: 'Voller Brustumfang (inkl. Bequemlichkeitszugabe)',
    en: 'Full chest measurement (include ease)',
  },
  bodyLengthHint: {
    de: 'Von Schulter bis Saum',
    en: 'From shoulder to bottom hem',
  },
  armholeDepthHint: {
    de: 'Von Schulter bis Unterarm',
    en: 'From shoulder to underarm',
  },
  sleeveLengthHint: {
    de: 'Von Unterarm bis Handgelenk',
    en: 'From underarm to wrist',
  },

  // Chart Visualizer
  selectColorInstruction: {
    de: 'Wähle eine Farbe und klicke auf Maschen, um sie zu ändern:',
    en: 'Select a color, then click on stitches to change them:',
  },
  selected: {
    de: 'Ausgewählt',
    en: 'Selected',
  },

  // Yarn Shopping List
  yarnShoppingList: {
    de: 'Garn-Einkaufsliste',
    en: 'Yarn Shopping List',
  },
  totalYardage: {
    de: 'Gesamtlänge (geschätzt)',
    en: 'Total Yardage (estimate)',
  },
  yarnTip: {
    de: 'Tipp: Kaufe ein zusätzliches Knäuel jeder Farbe zur Sicherheit!',
    en: 'Tip: Buy an extra skein of each color to be safe!',
  },

  // Project Manager
  projects: {
    de: 'Projekte',
    en: 'Projects',
  },
  myProjects: {
    de: 'Meine Projekte',
    en: 'My Projects',
  },
  storage: {
    de: 'Speicher',
    en: 'Storage',
  },
  used: {
    de: 'belegt',
    en: 'used',
  },
  newProject: {
    de: 'Neues Projekt',
    en: 'New Project',
  },
  noSavedProjects: {
    de: 'Noch keine gespeicherten Projekte.',
    en: 'No saved projects yet.',
  },
  projectsWillAppear: {
    de: 'Deine Projekte erscheinen hier, nachdem du sie gespeichert hast.',
    en: 'Your projects will appear here after you save them.',
  },
  unsaved: {
    de: 'ungespeichert',
    en: 'unsaved',
  },
  clickToRename: {
    de: 'Klicken zum Umbenennen',
    en: 'Click to rename',
  },
  failedToSave: {
    de: 'Speichern fehlgeschlagen. Speicher könnte voll sein.',
    en: 'Failed to save project. Storage may be full.',
  },

  // Difficulty Badge
  beginner: {
    de: 'Anfänger',
    en: 'Beginner',
  },
  intermediate: {
    de: 'Mittel',
    en: 'Intermediate',
  },
  simple2Color: {
    de: 'Einfaches 2-Farben-Design',
    en: 'Simple 2-color design',
  },
  colorsToManage: {
    de: 'Farben zu verwalten',
    en: 'colors to manage',
  },
  complexColorwork: {
    de: 'Farben - komplexe Farbarbeit',
    en: 'colors - complex colorwork',
  },
  mediumChart: {
    de: 'Mittelgroßes Diagramm',
    en: 'Medium-sized chart',
  },
  largeChart: {
    de: 'Großes Diagramm - längeres Projekt',
    en: 'Large chart - longer project',
  },
  frequentColorChanges: {
    de: 'Häufige Farbwechsel',
    en: 'Frequent color changes',
  },
  someColorChanges: {
    de: 'Einige Farbwechsel pro Reihe',
    en: 'Some color changes per row',
  },

  // Error Messages
  failedToProcess: {
    de: 'Bild konnte nicht verarbeitet werden. Bitte versuche ein anderes Bild.',
    en: 'Failed to process image. Please try a different image.',
  },
  noChartAvailable: {
    de: 'Kein Diagramm verfügbar',
    en: 'No chart available',
  },
  patternValidationFailed: {
    de: 'Mustervalidierung fehlgeschlagen',
    en: 'Pattern validation failed',
  },
  failedToGeneratePattern: {
    de: 'Muster konnte nicht erstellt werden',
    en: 'Failed to generate pattern',
  },
  noPatternAvailable: {
    de: 'Kein Muster verfügbar',
    en: 'No pattern available',
  },
  failedToGeneratePDF: {
    de: 'PDF konnte nicht erstellt werden',
    en: 'Failed to generate PDF',
  },

  // Language
  language: {
    de: 'Sprache',
    en: 'Language',
  },
  german: {
    de: 'Deutsch',
    en: 'German',
  },
  english: {
    de: 'Englisch',
    en: 'English',
  },

  // PDF-specific translations
  pdfPatternStudio: {
    de: 'MUSTER STUDIO',
    en: 'PATTERN STUDIO',
  },
  pdfColorworkPattern: {
    de: 'Mehrfarbiges Muster',
    en: 'Colorwork Pattern',
  },
  pdfSize: {
    de: 'Größe',
    en: 'Size',
  },
  pdfGauge: {
    de: 'MASCHENPROBE',
    en: 'GAUGE',
  },
  pdfYarnWeight: {
    de: 'GARNSTÄRKE',
    en: 'YARN WEIGHT',
  },
  pdfMaterialsRequired: {
    de: 'BENÖTIGTE MATERIALIEN',
    en: 'MATERIALS REQUIRED',
  },
  pdfYardsTotal: {
    de: 'Yards gesamt',
    en: 'yards total',
  },
  pdfMaterialsPrep: {
    de: 'Materialien & Vorbereitung',
    en: 'Materials & Preparation',
  },
  pdfYarnRequirements: {
    de: 'GARNBEDARF',
    en: 'YARN REQUIREMENTS',
  },
  pdfYards: {
    de: 'Yards',
    en: 'yds',
  },
  pdfSkein: {
    de: 'Knäuel',
    en: 'skein',
  },
  pdfSkeins: {
    de: 'Knäuel',
    en: 'skeins',
  },
  pdfTotal: {
    de: 'Gesamt:',
    en: 'Total:',
  },
  pdfYarnNote: {
    de: 'Hinweis: Kaufe zusätzliches Garn für Maschenprobenvariationen. Berechnet mit 220 Yards pro Knäuel.',
    en: 'Note: Purchase extra yarn to account for gauge variations. Yardage calculated at 220 yards per skein.',
  },
  pdfToolsNotions: {
    de: 'Werkzeuge & Zubehör',
    en: 'Tools & Notions',
  },
  pdfNeedles: {
    de: 'Nadeln:',
    en: 'Needles:',
  },
  pdfNotions: {
    de: 'Zubehör:',
    en: 'Notions:',
  },
  pdfGaugeReminder: {
    de: 'Stricke immer eine 10 x 10 cm Maschenprobe und spanne sie vor Projektbeginn.',
    en: 'Always knit a 4" × 4" gauge swatch and block before starting your project.',
  },
  pdfInStockinette: {
    de: '= 1 Zoll in glatt rechts',
    en: '= 1 inch in stockinette',
  },
  pdfFinishedMeasurements: {
    de: 'Fertige Maße',
    en: 'Finished Measurements',
  },
  pdfCircumference: {
    de: 'Umfang',
    en: 'Circumference',
  },
  pdfWithNegativeEase: {
    de: '(mit negativer Weite)',
    en: '(with negative ease)',
  },
  pdfHeight: {
    de: 'Höhe',
    en: 'Height',
  },
  pdfBrimDepth: {
    de: 'Bundtiefe',
    en: 'Brim Depth',
  },
  pdfWidth: {
    de: 'Breite',
    en: 'Width',
  },
  pdfLength: {
    de: 'Länge',
    en: 'Length',
  },
  pdfChest: {
    de: 'Brustumfang',
    en: 'Chest',
  },
  pdfBodyLength: {
    de: 'Körperlänge',
    en: 'Body Length',
  },
  pdfArmholeDepth: {
    de: 'Armausschnitttiefe',
    en: 'Armhole Depth',
  },
  pdfSleeveLength: {
    de: 'Ärmellänge',
    en: 'Sleeve Length',
  },
  pdfAbbreviations: {
    de: 'Abkürzungen',
    en: 'Abbreviations',
  },
  pdfPatternInstructions: {
    de: 'Anleitung',
    en: 'Pattern Instructions',
  },
  pdfColorworkChart: {
    de: 'Farbmuster-Diagramm',
    en: 'Colorwork Chart',
  },
  pdfStitchesWide: {
    de: 'Maschen breit',
    en: 'stitches wide',
  },
  pdfRowsTall: {
    de: 'Reihen hoch',
    en: 'rows tall',
  },
  pdfHowToRead: {
    de: 'WIE LIEST MAN DIESES DIAGRAMM',
    en: 'HOW TO READ THIS CHART',
  },
  pdfOddRows: {
    de: 'Ungerade Reihen (RS): Von rechts nach links lesen',
    en: 'Odd rows (RS): Read right to left',
  },
  pdfEvenRows: {
    de: 'Gerade Reihen (WS): Von links nach rechts lesen',
    en: 'Even rows (WS): Read left to right',
  },
  pdfAllRoundsRS: {
    de: 'Alle Runden von rechts nach links lesen (in Runden gestrickt)',
    en: 'Read all rounds right to left (knit in the round)',
  },
  pdfChartNotAvailable: {
    de: '[Diagramm nicht verfügbar]',
    en: '[Chart image not available]',
  },
  pdfColorKey: {
    de: 'FARBSCHLÜSSEL',
    en: 'COLOR KEY',
  },
  pdfBrandStudio: {
    de: 'KnitCraft Muster Studio',
    en: 'KnitCraft Pattern Studio',
  },
  pdfBeanie: {
    de: 'Mütze',
    en: 'Beanie',
  },
  pdfScarf: {
    de: 'Schal',
    en: 'Scarf',
  },
  pdfSweater: {
    de: 'Pullover',
    en: 'Sweater',
  },
  pdfColors: {
    de: 'Farben',
    en: 'colors',
  },

  // Pattern section titles
  sectionBeforeYouBegin: {
    de: 'Bevor du beginnst',
    en: 'Before You Begin',
  },
  sectionBrim: {
    de: 'Bund',
    en: 'Brim',
  },
  sectionBody: {
    de: 'Körper',
    en: 'Body',
  },
  sectionCrownShaping: {
    de: 'Kronenabnahmen',
    en: 'Crown Shaping',
  },
  sectionFinishing: {
    de: 'Fertigstellung',
    en: 'Finishing',
  },
  sectionBorder: {
    de: 'Rand',
    en: 'Border',
  },
  sectionMainBody: {
    de: 'Hauptteil',
    en: 'Main Body',
  },
  sectionBack: {
    de: 'Rückenteil',
    en: 'Back',
  },
  sectionFront: {
    de: 'Vorderteil',
    en: 'Front',
  },
  sectionSleeves: {
    de: 'Ärmel',
    en: 'Sleeves',
  },
  sectionAssembly: {
    de: 'Zusammennähen',
    en: 'Assembly',
  },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Language): string {
  return translations[key][lang];
}
