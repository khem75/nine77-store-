'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import type { ResolvedCampaign } from '@/types/campaign';
import { masterSlideVariants, reducedMotionSlideVariants } from './HeroAnimations';

interface HeroSlideProps {
  campaign: ResolvedCampaign;
  isActive: boolean;
  isPreload: boolean;
  isFirstSlide: boolean;
  featureFlags?: {
    videoEnabled?: boolean;
    sceneEnabled?: boolean;
  };
}

export default function HeroSlide({
  campaign,
  isActive,
  isPreload,
  isFirstSlide,
  featureFlags = { videoEnabled: true, sceneEnabled: false }
}: HeroSlideProps) {
  const [imgLoaded, setImgLoaded] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Reset states on campaign change
  useEffect(() => {
    setImgLoaded(true);
    setLoadError(false);
  }, [campaign.id, campaign.version]);

  // Versioned URL helper for cache-busting (Next.js Image requires clean local paths without query strings)
  const getVersionedUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('/')) return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${campaign.version || 1}`;
  };

  const desktopMedia = campaign.media.desktop;
  const mobileMedia  = campaign.media.mobile || desktopMedia;

  const desktopFocalX = desktopMedia.focalPoint?.x ?? 50;
  const desktopFocalY = desktopMedia.focalPoint?.y ?? 22;
  const mobileFocalX  = mobileMedia.focalPoint?.x ?? 50;
  const mobileFocalY  = mobileMedia.focalPoint?.y ?? 18;

  const accentColor = campaign.theme.accent;

  const bgPlaceholderStyle: React.CSSProperties = {
    background: `radial-gradient(circle at 50% 30%, ${accentColor}14 0%, #050505 75%)`,
    transition: 'opacity 0.8s ease-in-out',
  };

  const isVideo = campaign.type === 'video' && featureFlags.videoEnabled;

  if (!isActive && !isPreload) return null;

  return (
    <motion.div
      key={campaign.id}
      variants={shouldReduceMotion ? reducedMotionSlideVariants : masterSlideVariants}
      initial="enter"
      animate={isActive ? "center" : "exit"}
      exit="exit"
      className={`absolute inset-0 w-full h-full ${
        isActive ? 'z-[6] pointer-events-auto' : 'z-[5] pointer-events-none'
      }`}
      style={{
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
      }}
    >
      {/* Loading placeholder */}
      {loadError && (
        <div className="absolute inset-0 z-[1] w-full h-full" style={bgPlaceholderStyle}>
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <span className="text-[10px] font-black tracking-[0.65em] text-white">NINE77</span>
          </div>
        </div>
      )}

      {/* Media layer with Ken Burns zoom */}
      {!loadError && (
        <div
          className="w-full h-full relative transition-opacity duration-700 opacity-100"
          style={{
            animation: isActive && !shouldReduceMotion ? 'kenBurns 25s ease-in-out forwards' : 'none',
            willChange: 'transform',
            transform: 'translateZ(0)',
          }}
        >
          {isVideo ? (
            <>
              {/* Desktop video */}
              <video
                src={getVersionedUrl(desktopMedia.url)}
                autoPlay={isActive}
                loop
                muted
                playsInline
                preload={isActive ? 'auto' : 'metadata'}
                onLoadedData={() => setImgLoaded(true)}
                onError={() => setLoadError(true)}
                className="hidden md:block absolute inset-0 w-full h-full object-cover opacity-90"
                style={{ objectPosition: `${desktopFocalX}% ${desktopFocalY}%` }}
              />
              {/* Mobile video */}
              <video
                src={getVersionedUrl(mobileMedia.url)}
                autoPlay={isActive}
                loop
                muted
                playsInline
                preload={isActive ? 'auto' : 'metadata'}
                onLoadedData={() => setImgLoaded(true)}
                onError={() => setLoadError(true)}
                className="block md:hidden absolute inset-0 w-full h-full object-cover opacity-95"
                style={{ objectPosition: `${mobileFocalX}% ${mobileFocalY}%` }}
              />
            </>
          ) : (
            <>
              {/* Desktop image — Full HD 100% Uncompressed Quality */}
              <div className="hidden md:block absolute inset-0 w-full h-full">
                <Image
                  src={getVersionedUrl(desktopMedia.url)}
                  alt={desktopMedia.alt || 'NINE77 Campaign'}
                  fill
                  priority={isFirstSlide}
                  loading={isFirstSlide ? 'eager' : 'lazy'}
                  quality={100}
                  unoptimized
                  sizes="100vw"
                  className="object-cover"
                  style={{
                    objectPosition: `${desktopFocalX}% ${desktopFocalY}%`,
                    opacity: 0.95,
                  }}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setLoadError(true)}
                />
              </div>

              {/* Mobile image — Full HD 100% Uncompressed Quality */}
              <div className="block md:hidden absolute inset-0 w-full h-full">
                <Image
                  src={getVersionedUrl(mobileMedia.url)}
                  alt={mobileMedia.alt || 'NINE77 Campaign'}
                  fill
                  priority={isFirstSlide}
                  loading={isFirstSlide ? 'eager' : 'lazy'}
                  quality={100}
                  unoptimized
                  sizes="100vw"
                  className="object-cover"
                  style={{
                    objectPosition: `${mobileFocalX}% ${mobileFocalY}%`,
                    opacity: 0.95,
                  }}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setLoadError(true)}
                />
              </div>
            </>
          )}

          {/* Vignette & Gradient Overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                linear-gradient(to right, rgba(5,5,5,0.78) 0%, rgba(5,5,5,0.42) 42%, rgba(5,5,5,0.1) 70%, transparent 100%),
                linear-gradient(to top, #050505 0%, rgba(5,5,5,0.45) 25%, transparent 60%)
              `,
            }}
          />
        </div>
      )}
    </motion.div>
  );
}
