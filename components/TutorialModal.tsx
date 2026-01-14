'use client';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="max-w-lg w-full max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--color-card)',
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: 'var(--shadow-hover)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 sticky top-0"
          style={{
            backgroundColor: 'var(--color-card)',
            borderBottom: '1px solid var(--color-card-border)',
          }}
        >
          <h2
            className="text-xl font-semibold flex items-center gap-2"
            style={{
              color: 'var(--color-text)',
              fontFamily: 'var(--font-heading)',
            }}
          >
            <svg className="w-5 h-5" style={{ color: 'var(--color-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How to Read a Knitting Chart
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded"
            style={{
              backgroundColor: 'var(--color-background-secondary)',
            }}
          >
            <svg className="w-6 h-6" style={{ color: 'var(--color-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* What is a chart */}
          <section>
            <h3
              className="font-semibold mb-2"
              style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
            >
              What the Chart Represents
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Each square in the chart represents one stitch. The colors show which yarn color to use for that stitch.
              The chart is a visual map of your colorwork pattern.
            </p>
          </section>

          {/* Reading direction */}
          <section>
            <h3
              className="font-semibold mb-2"
              style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
            >
              Reading Direction
            </h3>
            <div
              className="p-3 rounded-lg mb-2"
              style={{ backgroundColor: 'var(--color-background-secondary)' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="text-xs font-medium px-2 py-1 rounded"
                  style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                >
                  RS (Right Side)
                </span>
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Read right to left
                </span>
                <svg className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-medium px-2 py-1 rounded"
                  style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
                >
                  WS (Wrong Side)
                </span>
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Read left to right
                </span>
                <svg className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Odd rows (1, 3, 5...) are typically RS rows. Even rows (2, 4, 6...) are WS rows.
            </p>
          </section>

          {/* Color key */}
          <section>
            <h3
              className="font-semibold mb-2"
              style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
            >
              Color Key
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              The color legend shows which yarn color each square color represents.
              Match the square color to your yarn when knitting that stitch.
            </p>
          </section>

          {/* Abbreviations */}
          <section>
            <h3
              className="font-semibold mb-2"
              style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
            >
              Common Abbreviations
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                { abbr: 'K', meaning: 'Knit' },
                { abbr: 'P', meaning: 'Purl' },
                { abbr: 'K2tog', meaning: 'Knit 2 together' },
                { abbr: 'SSK', meaning: 'Slip, slip, knit' },
                { abbr: 'CO', meaning: 'Cast on' },
                { abbr: 'BO', meaning: 'Bind off' },
                { abbr: 'St(s)', meaning: 'Stitch(es)' },
                { abbr: 'Rep', meaning: 'Repeat' },
              ].map(({ abbr, meaning }) => (
                <div
                  key={abbr}
                  className="flex items-center gap-2 p-2 rounded"
                  style={{ backgroundColor: 'var(--color-background-secondary)' }}
                >
                  <span className="font-mono font-bold" style={{ color: 'var(--color-primary)' }}>
                    {abbr}
                  </span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>= {meaning}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Tips */}
          <section>
            <h3
              className="font-semibold mb-2"
              style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
            >
              Tips for Success
            </h3>
            <ul
              className="text-sm space-y-2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <li className="flex items-start gap-2">
                <span style={{ color: 'var(--color-success)' }}>*</span>
                Always knit a gauge swatch before starting
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: 'var(--color-success)' }}>*</span>
                Use the row tracker to keep your place
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: 'var(--color-success)' }}>*</span>
                Carry unused yarn loosely across the back
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: 'var(--color-success)' }}>*</span>
                Catch long floats (5+ stitches) to prevent snagging
              </li>
            </ul>
          </section>

          {/* External resources */}
          <section
            className="p-3 rounded-lg"
            style={{
              backgroundColor: 'var(--color-background-secondary)',
              border: '1px solid var(--color-card-border)',
            }}
          >
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <strong style={{ color: 'var(--color-text)' }}>Want to learn more?</strong>
              <br />
              Search for "stranded colorwork knitting tutorial" on YouTube for video guides.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div
          className="p-4 sticky bottom-0"
          style={{
            backgroundColor: 'var(--color-card)',
            borderTop: '1px solid var(--color-card-border)',
          }}
        >
          <button
            onClick={onClose}
            className="btn-primary w-full"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
