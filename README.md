# Knitting Pattern Generator

Turn any image into a custom knitting pattern! Upload an image, select a garment type (beanie, scarf, or sweater), customize your options, and download a complete knitting pattern with chart and instructions.

## Features

- **Image to Chart Conversion**: Automatically converts any image to a knittable stitch chart
- **Multiple Garment Types**: Beanies, scarves, and sweaters
- **Size Options**: Multiple sizes for each garment type
- **Yarn Weight Selection**: Support for fingering through bulky weights
- **Color Matching**: Automatically maps image colors to real yarn colors
- **Complete Patterns**: Generated patterns include materials, gauge, instructions, and charts
- **Downloadable**: Export patterns as text files (PDF coming soon)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

### Step 1: Upload an Image
- Click or drag-and-drop an image file (PNG, JPG, or SVG)
- Best results with simple images (2-6 colors)
- High contrast designs work better
- Bold shapes are easier to knit than fine details

### Step 2: Customize
- Select garment type (beanie, scarf, or sweater)
- Choose size
- Select yarn weight (affects gauge)
- Review the generated chart

### Step 3: Download Pattern
- Review pattern details and materials needed
- Download the complete pattern as a text file
- Start knitting!

## Project Structure

```
├── app/
│   ├── api/
│   │   └── process-image/    # API routes
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Main application page
│   └── globals.css           # Global styles
├── components/
│   ├── ChartVisualizer.tsx   # Displays knitting chart
│   ├── CustomizationPanel.tsx # Garment customization UI
│   └── ImageUpload.tsx       # Image upload component
├── lib/
│   ├── image-processing/
│   │   ├── chartGenerator.ts # Image to chart conversion
│   │   └── validator.ts      # Image validation
│   ├── knitting/
│   │   ├── measurements.ts   # Standard measurements & gauge
│   │   ├── yarnCalculator.ts # Yarn requirement calculations
│   │   └── yarnColors.ts     # Yarn color palette
│   ├── pattern-generation/
│   │   ├── beanieGenerator.ts  # Beanie patterns
│   │   ├── scarfGenerator.ts   # Scarf patterns
│   │   └── sweaterGenerator.ts # Sweater patterns
│   ├── store.ts              # State management (Zustand)
│   └── types.ts              # TypeScript type definitions
└── public/                   # Static assets
```

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Image Processing**: Canvas API (browser-based)
- **Deployment**: Optimized for Vercel

## Deployment to Vercel

### Option 1: Automatic Deployment (Easiest)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Click "Deploy"

That's it! Vercel will automatically detect it's a Next.js app and deploy it.

### Option 2: Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts

### Your Deployed URL
Once deployed, you'll get a URL like: `https://knitting-pattern-generator.vercel.app`

Share this URL with your mother for testing!

## Testing Checklist for Your Mother

### Basic Functionality
- [ ] Upload a simple image (logo, emoji, simple graphic)
- [ ] Check that the chart looks correct
- [ ] Try all three garment types (beanie, scarf, sweater)
- [ ] Download a pattern for each type
- [ ] Verify pattern is readable

### Image Testing
- [ ] Try a photo (should show warnings about complexity)
- [ ] Try different image sizes
- [ ] Try images with different color counts
- [ ] Note which images work well vs poorly

### Pattern Quality
- [ ] Are the measurements reasonable?
- [ ] Is the yarn yardage calculation accurate?
- [ ] Are the instructions clear?
- [ ] Is anything missing from the pattern?
- [ ] Would she actually use this pattern to knit?

### Recommended Test Project
Generate a beanie pattern with a simple design and actually knit it! This is the best way to validate:
- Pattern accuracy
- Instruction clarity
- Yarn calculations
- Chart readability

## Known Limitations (MVP)

- Patterns are exported as text files (PDF generation coming soon)
- No 3D visualization yet (planned for V2)
- Limited construction methods (simplest approach for each garment)
- No user accounts or pattern saving
- Chart visualization is basic (no print-optimized version yet)

## Feedback

Please collect feedback on:
1. **User Experience**: What's confusing? What's intuitive?
2. **Pattern Quality**: Are patterns accurate and complete?
3. **Features**: What's missing? What would make this more useful?
4. **Pricing**: What would you pay for this? Per pattern? Subscription?
5. **Marketing**: Would you share this with friends? Where would you discover this?

## Future Enhancements

### V2 Features
- PDF export with professional formatting
- 3D garment visualization
- More garment types (cardigan, mittens, socks)
- More construction methods (raglan, top-down, seamless)
- User accounts and pattern library
- Pattern editing and customization
- Community features (share patterns, rate patterns)

### Technical Improvements
- Server-side image processing with Sharp
- Better color quantization algorithms
- AI image generation integration
- Pattern testing simulation
- Yarn shop API integrations

## Support

Questions? Issues? Contact information here.

## License

MIT License - feel free to use and modify for your needs.

---

Built by Greg
Powered by Next.js and deployed on Vercel
