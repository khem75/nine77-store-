'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import type { ResolvedCampaign } from '@/types/campaign';

interface HeroSlideProps {
  campaign: ResolvedCampaign;
  isActive: boolean;
  isPreload: boolean;
  featureFlags?: {
    videoEnabled?: boolean;
    sceneEnabled?: boolean;
  };
}

export default function HeroSlide({
  campaign,
  isActive,
  isPreload,
  featureFlags = { videoEnabled: true, sceneEnabled: false }
}: HeroSlideProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Reset states if campaign changes and set a safety fallback timeout for blur transition
  useEffect(() => {
    setImgLoaded(false);
    setLoadError(false);

    // Defensive callback: if image load triggers slowly or is cached, clear blur anyway
    const timer = setTimeout(() => {
      setImgLoaded(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [campaign.id, campaign.version]);

  // Expose versioned query parameters for image/video caching bust
  const getVersionedUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('/')) return url; // Ignore base64 and local static public files
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${campaign.version}`;
  };

  const desktopMedia = campaign.media.desktop;
  const mobileMedia = campaign.media.mobile || desktopMedia;

  const desktopFocalX = desktopMedia.focalPoint?.x ?? 50;
  const desktopFocalY = desktopMedia.focalPoint?.y ?? 50;
  
  const mobileFocalX = mobileMedia.focalPoint?.x ?? 50;
  const mobileFocalY = mobileMedia.focalPoint?.y ?? 50;

  const accentColor = campaign.theme.accent;
  
  // Custom linear-gradient placeholder to prevent dark/empty flash during load
  const bgPlaceholderStyle: React.CSSProperties = {
    background: `radial-gradient(circle at center, ${accentColor}18 0%, #050505 80%)`,
    transition: 'opacity 0.8s ease-in-out',
  };

  // Determine if it should display video or static image
  const isVideo = campaign.type === 'video' && featureFlags.videoEnabled;

  return (
    <div
      className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
        isActive ? 'opacity-100 z-[6]' : 'opacity-0 z-[5] pointer-events-none'
      }`}
    >
      {/* 1. Glassmorphic/Accent background placeholder to prevent layout flashes */}
      {(!imgLoaded || loadError) && (
        <div className="absolute inset-0 z-[1] w-full h-full" style={bgPlaceholderStyle}>
          {/* Subtle loading spinner or identity mark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-25">
            <span className="text-[10px] font-black tracking-[0.6em] text-white">NINE77</span>
          </div>
        </div>
      )}

      {/* 2. Image fallback view if loading fails */}
      {loadError && (
        <div className="absolute inset-0 z-[2] bg-neutral-900/60 backdrop-blur-md flex flex-col items-center justify-center p-5 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
            Campaign Media Unavailable
          </p>
        </div>
      )}

      {/* 3. Media Render Layer */}
      {!loadError && (
        <div
          className={`w-full h-full relative transition-all duration-[1.2s] ease-[var(--theme-motion-hero)] ${
            imgLoaded ? 'scale-100 blur-0' : 'scale-[1.05] blur-[15px]'
          }`}
        >
          {isVideo ? (
            // VIDEO MEDIA RENDERER
            <>
              {/* Desktop Video */}
              <video
                src={getVersionedUrl(desktopMedia.url)}
                autoPlay={isActive}
                loop
                muted
                playsInline
                preload={isActive ? 'auto' : 'metadata'}
                onLoadedData={() => setImgLoaded(true)}
                onError={() => setLoadError(true)}
                className="hidden md:block absolute inset-0 w-full h-full object-cover opacity-50"
                style={{
                  objectPosition: `${desktopFocalX}% ${desktopFocalY}%`,
                }}
              />
              {/* Mobile Video */}
              <video
                src={getVersionedUrl(mobileMedia.url)}
                autoPlay={isActive}
                loop
                muted
                playsInline
                preload={isActive ? 'auto' : 'metadata'}
                onLoadedData={() => setImgLoaded(true)}
                onError={() => setLoadError(true)}
                className="block md:hidden absolute inset-0 w-full h-full object-cover opacity-70"
                style={{
                  objectPosition: `${mobileFocalX}% ${mobileFocalY}%`,
                }}
              />
            </>
          ) : (
            // IMAGE MEDIA RENDERER
            <>
              {/* Desktop image crop */}
              <div className="hidden md:block absolute inset-0">
                <Image
                  src={getVersionedUrl(desktopMedia.url)}
                  alt={desktopMedia.alt || 'NINE77 Campaign Image'}
                  fill
                  priority={isActive}
                  sizes="100vw"
                  className="object-cover opacity-50 transition-opacity duration-1000"
                  style={{
                    objectPosition: `${desktopFocalX}% ${desktopFocalY}%`,
                  }}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setLoadError(true)}
                />
              </div>

              {/* Mobile image crop */}
              <div className="block md:hidden absolute inset-0">
                <Image
                  src={getVersionedUrl(mobileMedia.url)}
                  alt={mobileMedia.alt || 'NINE77 Campaign Mobile Image'}
                  fill
                  priority={isActive}
                  sizes="100vw"
                  className="object-cover opacity-70 transition-opacity duration-1000"
                  style={{
                    objectPosition: `${mobileFocalX}% ${mobileFocalY}%`,
                  }}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setLoadError(true)}
                />
              </div>
            </>
          )}

          {/* Luxury ambient bottom shading vignette to keep text highly legible */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, #050505 0%, transparent 60%)',
            }}
          />
        </div>
      )}
    </div>
  );
}
