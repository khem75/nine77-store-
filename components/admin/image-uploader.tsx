'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, ImagePlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  bucket?: string;
  folder?: string;
  maxFiles?: number;
}

export default function ImageUploader({
  value,
  onChange,
  bucket = 'nine77-assets',
  folder = 'products',
  maxFiles = 6,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  // In mock mode we store object URLs locally (only valid in browser session)
  const [localPreviews, setLocalPreviews] = useState<Record<string, string>>({});

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const remaining = maxFiles - value.length;
      if (remaining <= 0) {
        toast.error(`Maximum ${maxFiles} images allowed`);
        return;
      }
      const filesToUpload = acceptedFiles.slice(0, remaining);

      setUploading(true);
      try {
        if (IS_MOCK) {
          // Mock: generate object URLs for preview
          const objectUrls = filesToUpload.map((f) => URL.createObjectURL(f));
          // Store mapping for preview rendering
          const newPreviews: Record<string, string> = {};
          objectUrls.forEach((url) => { newPreviews[url] = url; });
          setLocalPreviews((prev) => ({ ...prev, ...newPreviews }));
          onChange([...value, ...objectUrls]);
          toast.success(`${objectUrls.length} image${objectUrls.length > 1 ? 's' : ''} added (mock preview)`);
        } else {
          const { supabase, getPublicUrl } = await import('@/lib/supabase');
          const uploadedUrls = await Promise.all(
            filesToUpload.map(async (file) => {
              const ext = file.name.split('.').pop();
              const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
              const { error } = await supabase.storage
                .from(bucket)
                .upload(filename, file, { upsert: false });
              if (error) throw error;
              return getPublicUrl(bucket, filename);
            })
          );
          onChange([...value, ...uploadedUrls]);
          toast.success(`${uploadedUrls.length} image${uploadedUrls.length > 1 ? 's' : ''} uploaded`);
        }
      } catch (err: any) {
        toast.error(err.message ?? 'Upload failed');
      } finally {
        setUploading(false);
      }
    },
    [value, onChange, bucket, folder, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.avif'] },
    multiple: true,
    disabled: uploading || value.length >= maxFiles,
  });

  function removeImage(index: number) {
    const next = [...value];
    next.splice(index, 1);
    onChange(next);
  }

  // Resolve image src — object URLs work directly in <img>, but not next/image
  function renderPreview(url: string, i: number) {
    const isObjectUrl = url.startsWith('blob:');
    return (
      <div key={url + i} className="relative group aspect-square rounded-xl overflow-hidden border border-black/[0.08] bg-[#F4F4F6]">
        {/* Use plain <img> for blob URLs, next/image for real URLs */}
        {isObjectUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={`Product image ${i + 1}`} className="object-cover w-full h-full" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={`Product image ${i + 1}`} className="object-cover w-full h-full" />
        )}
        {/* Remove button */}
        <button
          type="button"
          onClick={() => removeImage(i)}
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity shadow-sm"
          aria-label="Remove image"
        >
          <X size={11} />
        </button>
        {i === 0 && (
          <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold uppercase tracking-wider bg-[#C9A227] text-[#111] px-1.5 py-0.5 rounded-md">
            Main
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Previews */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {value.map((url, i) => renderPreview(url, i))}
        </div>
      )}

      {/* Drop zone */}
      {value.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`admin-dropzone flex flex-col items-center justify-center gap-3 py-10 px-6 text-center transition-all ${
            isDragActive ? 'active' : ''
          } ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="w-12 h-12 rounded-xl bg-black/[0.04] flex items-center justify-center">
            {uploading ? (
              <Loader2 size={22} className="text-[#C9A227] animate-spin" />
            ) : (
              <ImagePlus size={22} className="text-[#9B9BA4]" />
            )}
          </div>
          {uploading ? (
            <p className="text-[13px] text-[#6B6B70] font-medium">Processing…</p>
          ) : isDragActive ? (
            <p className="text-[13px] text-[#C9A227] font-semibold">Drop images here</p>
          ) : (
            <>
              <div>
                <p className="text-[13px] font-semibold text-[#111111]">
                  Drag & drop images here
                </p>
                <p className="text-[12px] text-[#9B9BA4] mt-0.5">
                  or{' '}
                  <span className="text-[#C9A227] font-medium underline underline-offset-2 cursor-pointer">
                    browse files
                  </span>
                </p>
              </div>
              <p className="text-[11px] text-[#C0C0C8]">
                JPG, PNG, WEBP — Max {maxFiles} images ({value.length}/{maxFiles} used)
                {IS_MOCK && ' · Mock preview mode'}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
