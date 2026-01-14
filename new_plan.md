# Knitting Pattern Generator - V1.5 Features (Share with Mom)

## Overview
Features to add before sharing with family. Focus on usability, delight, and practical knitting needs.

---

## 1. Welcome Screen
**Priority: High | Effort: Medium**

A friendly landing page that introduces the app and gets users excited to try it.

**Requirements:**
- Hero section with app title and tagline
- Brief explanation of what the app does (3 steps: Upload → Customize → Knit)
- Visual preview/demo of generated patterns
- "Get Started" CTA button
- Theme-aware styling (works with Cute/Cozy/Clean)

**Files to create/modify:**
- `components/WelcomeScreen.tsx` (new)
- `app/page.tsx` (add welcome state)
- `lib/store.ts` (add hasSeenWelcome flag)

---

## 2. Sample Images
**Priority: High | Effort: Low**

Pre-loaded example images so users can try the app without uploading their own.

**Requirements:**
- 4-6 sample images (heart, star, flower, simple geometric, animal silhouette)
- Grid of clickable thumbnails on upload screen
- "Or try a sample" section below upload area
- Store images in `/public/samples/`

**Sample ideas:**
- `heart.png` - Simple red heart
- `star.png` - 5-point star
- `flower.png` - Simple daisy
- `cat.png` - Cat silhouette
- `snowflake.png` - Winter pattern
- `rainbow.png` - Rainbow stripes

**Files to create/modify:**
- `public/samples/` (new directory with images)
- `components/ImageUpload.tsx` (add sample picker)
- `components/SampleImagePicker.tsx` (new)

---

## 3. Print-Friendly View
**Priority: High | Effort: Medium**

One-click print button that formats the pattern nicely for paper.

**Requirements:**
- Print button on pattern preview page
- Print stylesheet that:
  - Removes navigation/UI chrome
  - Formats pattern instructions clearly
  - Includes chart at appropriate size
  - Adds page breaks between sections
  - Includes yarn requirements and materials list
- Works with browser's native print dialog

**Files to create/modify:**
- `app/globals.css` (add @media print styles)
- `components/PatternPreview.tsx` or page.tsx (add print button)
- `lib/pdf/printStyles.ts` (new - print formatting logic)

---

## 5. Row-by-Row Progress Tracker
**Priority: Medium | Effort: Medium**

Interactive tracker to check off rows as user knits them.

**Requirements:**
- Checkbox or click-to-complete for each row in chart
- Visual indication of completed rows (grayed out or highlighted)
- Progress bar showing % complete
- Persist progress in localStorage per project
- "Reset Progress" button
- Current row highlight/indicator

**Files to create/modify:**
- `components/ProgressTracker.tsx` (new)
- `components/ChartVisualizer.tsx` (add row click handlers)
- `lib/store.ts` (add progress state)
- `lib/projectStorage.ts` (save progress with project)

---

## 6. Yarn Shopping List
**Priority: Medium | Effort: Low**

Exportable list of yarn colors and amounts for the craft store.

**Requirements:**
- Clean formatted list showing:
  - Color name
  - Suggested yarn brand/type
  - Yardage needed
  - Number of skeins to buy
- Copy to clipboard button
- Download as text file option
- Print-friendly format

**Files to create/modify:**
- `components/YarnShoppingList.tsx` (new)
- Add to pattern preview page

---

## 7. Difficulty Rating
**Priority: Low | Effort: Low**

Visual indicator of pattern complexity.

**Requirements:**
- Calculate difficulty based on:
  - Number of colors (more = harder)
  - Chart size (larger = longer)
  - Color change frequency
- Display as: Beginner / Intermediate / Advanced
- Show with icon (yarn ball rating or stars)
- Include in pattern output

**Algorithm:**
- 2 colors = Beginner
- 3-4 colors = Intermediate
- 5+ colors = Advanced
- Adjust based on frequent color changes per row

**Files to create/modify:**
- `lib/knitting/difficultyCalculator.ts` (new)
- `components/DifficultyBadge.tsx` (new)
- Add to pattern preview and project cards

---

## 8. Chart Zoom
**Priority: Medium | Effort: Medium**

Pinch-to-zoom and zoom controls for easier chart reading.

**Requirements:**
- Zoom in/out buttons (+/-)
- Pinch-to-zoom on touch devices
- Zoom level indicator (50%, 100%, 150%, 200%)
- Pan/scroll when zoomed in
- "Fit to screen" reset button
- Remember zoom preference

**Files to create/modify:**
- `components/ChartVisualizer.tsx` (add zoom controls)
- Consider using a library like `react-zoom-pan-pinch`

---

## 9. Share via Link
**Priority: Low | Effort: High**

Generate shareable URLs to send patterns to friends.

**Requirements:**
- "Share" button on pattern preview
- Options:
  - Copy link to clipboard
  - Share to social media (optional)
- Either:
  - Encode pattern data in URL (for small patterns)
  - Or: Upload to simple backend and generate short URL
- Shared view is read-only

**Approach options:**
1. **URL encoding** - Compress pattern data into URL params (limited size)
2. **Vercel KV/Redis** - Store pattern, generate short ID
3. **GitHub Gist** - Store as JSON gist (requires GitHub auth)

**Files to create/modify:**
- `components/ShareButton.tsx` (new)
- `lib/sharing.ts` (new - encoding/decoding logic)
- `app/share/[id]/page.tsx` (new - shared pattern view)

---

## 10. Pattern Tutorial
**Priority: Low | Effort: Low**

Brief guide on how to read a knitting chart.

**Requirements:**
- Modal or expandable section with:
  - What the chart represents
  - How to read rows (right-to-left on RS, left-to-right on WS)
  - Color key explanation
  - Basic knitting abbreviations
- "Help" or "?" button to access
- Don't show every time (dismissible)
- Link to external resources for beginners

**Files to create/modify:**
- `components/TutorialModal.tsx` (new)
- Add help button to chart visualizer

---

## Implementation Order

### Phase 1 - Core Experience
1. Welcome Screen
2. Sample Images
3. Print-Friendly View

### Phase 2 - Knitting Helpers
5. Row Progress Tracker
6. Yarn Shopping List
7. Difficulty Rating

### Phase 3 - Polish
8. Chart Zoom
9. Share via Link
10. Pattern Tutorial

---

## Notes
- All features should work with existing theme system (Cute/Cozy/Clean)
- Mobile-friendly is important (Mom might use iPad)
- Keep UI simple and uncluttered
- Test with actual knitting workflow in mind
