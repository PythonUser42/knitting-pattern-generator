'use client';

import { useCallback, useState } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import SampleImagePicker from './SampleImagePicker';

interface ImageUploadProps {
  onImageSelected?: () => void;
}

export default function ImageUpload({ onImageSelected }: ImageUploadProps = {}) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const setUploadedImage = useStore((state) => state.setUploadedImage);
  const { t } = useTranslation();

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert(t('pleaseUploadImage'));
      return;
    }

    setUploadedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      onImageSelected?.();
    };
    reader.readAsDataURL(file);
  }, [setUploadedImage, onImageSelected]);

  const handleSampleSelect = useCallback((dataUrl: string) => {
    setPreview(dataUrl);
    onImageSelected?.();
  }, [onImageSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  return (
    <div className="w-full">
      {/* Main Upload Card */}
      <div
        className="card overflow-hidden"
        style={{
          padding: 0,
          background: 'var(--color-card)',
        }}
      >
        <form
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className="relative"
        >
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />

          <label
            htmlFor="image-upload"
            className="upload-area flex flex-col items-center justify-center w-full cursor-pointer transition-all"
            style={{
              minHeight: preview ? '100px' : '120px',
              background: dragActive
                ? 'linear-gradient(135deg, var(--color-background-secondary) 0%, var(--color-card) 100%)'
                : 'var(--color-card)',
              borderBottom: '1px solid var(--color-card-border)',
            }}
          >
            {preview ? (
              <div className="flex flex-col items-center gap-2 p-4">
                <div
                  className="relative group"
                  style={{
                    padding: '8px',
                    background: 'var(--color-background-secondary)',
                    borderRadius: 'var(--border-radius)',
                  }}
                >
                  <img
                    src={preview}
                    alt="Upload preview"
                    className="max-h-40 max-w-full object-contain"
                    style={{ borderRadius: '8px' }}
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: 'rgba(0,0,0,0.4)',
                      borderRadius: 'var(--border-radius)',
                    }}
                  >
                    <span className="text-white text-sm font-medium">{t('changeImage')}</span>
                  </div>
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                  {t('clickOrDragReplace')}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-3">
                {/* Upload Icon */}
                <div
                  className="upload-icon relative mb-2"
                  style={{
                    width: '44px',
                    height: '44px',
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-xl transition-transform"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                      transform: dragActive ? 'scale(1.1)' : 'scale(1)',
                      boxShadow: '0 4px 12px -4px rgba(0,0,0,0.2)',
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      style={{ width: '20px', height: '20px', color: 'white' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Text */}
                <p className="upload-text-main" style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px', color: 'var(--color-text)' }}>
                  {t('dropImageHere')}
                </p>
                <p className="upload-text-sub" style={{ fontSize: '12px', marginBottom: '8px', color: 'var(--color-text-muted)' }}>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                    {t('browseFiles')}
                  </span>
                </p>

                {/* File types */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  {['PNG', 'JPG', 'SVG'].map((type) => (
                    <span
                      key={type}
                      style={{
                        padding: '2px 6px',
                        fontSize: '9px',
                        fontWeight: 600,
                        borderRadius: '3px',
                        background: 'var(--color-background-secondary)',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </label>
        </form>

        {/* Tips Section - Hidden on mobile */}
        <div
          className="tips-section"
          style={{
            padding: '10px 12px',
            background: 'var(--color-background-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div
              style={{
                flexShrink: 0,
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-card)',
                border: '1px solid var(--color-card-border)',
              }}
            >
              <svg style={{ width: '14px', height: '14px', color: 'var(--color-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px', color: 'var(--color-text)' }}>
                {t('forBestResults')}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                {t('imageTips')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Images */}
      {!preview && <SampleImagePicker onSelect={handleSampleSelect} />}
    </div>
  );
}
