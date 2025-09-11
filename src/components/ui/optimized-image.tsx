'use client';

import { useState, useRef, useEffect, forwardRef } from 'react';

import Image from 'next/image';

import { cn } from '@/lib/utils';

export interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  priority?: boolean
  loading?: 'lazy' | 'eager'
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  className?: string
  fallback?: string
  onLoadingComplete?: () => void
  onError?: () => void
  enableWebP?: boolean
  enableAVIF?: boolean
  lazyLoadOffset?: number
  showLoadingSpinner?: boolean
  aspectRatio?: number
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  retryAttempts?: number
  retryDelay?: number
}

interface ImageState {
  isLoading: boolean
  hasError: boolean
  isInView: boolean
  retryCount: number
  currentSrc: string
}

const OptimizedImage = forwardRef<HTMLDivElement, OptimizedImageProps>(
  ({
    src,
    alt,
    width,
    height,
    fill = false,
    sizes = '100vw',
    priority = false,
    loading = 'lazy',
    quality = 75,
    placeholder = 'empty',
    blurDataURL,
    className,
    fallback,
    onLoadingComplete,
    onError,
    enableWebP = true,
    enableAVIF = true,
    lazyLoadOffset = 100,
    showLoadingSpinner = true,
    aspectRatio,
    objectFit = 'cover',
    retryAttempts = 3,
    retryDelay = 1000,
    ...props
  }, ref) => {
    const [state, setState] = useState<ImageState>({
      isLoading: !priority,
      hasError: false,
      isInView: priority,
      retryCount: 0,
      currentSrc: src
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const retryTimeoutRef = useRef<NodeJS.Timeout>();

    // Generate optimized src URLs
    const generateOptimizedSrc = (originalSrc: string, format?: 'webp' | 'avif') => {
      if (!format) return originalSrc;

      // This would integrate with your image optimization service
      // For now, we'll assume a CDN that supports format conversion
      const url = new URL(originalSrc, window.location.origin);
      url.searchParams.set('format', format);
      url.searchParams.set('quality', quality.toString());

      if (width) url.searchParams.set('w', width.toString());
      if (height) url.searchParams.set('h', height.toString());

      return url.toString();
    };

    // Create srcset for responsive images
    const generateSrcSet = () => {
      if (!width) return undefined;

      const breakpoints = [640, 768, 1024, 1280, 1536];
      const srcSet: string[] = [];

      breakpoints.forEach(bp => {
        if (bp <= width * 2) { // Don't generate larger than 2x original
          const optimizedSrc = generateOptimizedSrc(src);
          const url = new URL(optimizedSrc, window.location.origin);
          url.searchParams.set('w', bp.toString());
          srcSet.push(`${url.toString()} ${bp}w`);
        }
      });

      return srcSet.length > 0 ? srcSet.join(', ') : undefined;
    };

    // Intersection Observer for lazy loading
    useEffect(() => {
      if (priority || state.isInView) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setState(prev => ({ ...prev, isInView: true }));
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: `${lazyLoadOffset}px`,
          threshold: 0.01
        }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    }, [priority, state.isInView, lazyLoadOffset]);

    // Handle image load success
    const handleLoadingComplete = () => {
      setState(prev => ({ ...prev, isLoading: false }));
      onLoadingComplete?.();
    };

    // Handle image load error with retry logic
    const handleError = () => {
      setState(prev => {
        const newRetryCount = prev.retryCount + 1;

        if (newRetryCount <= retryAttempts) {
          // Retry after delay
          retryTimeoutRef.current = setTimeout(() => {
            setState(current => ({
              ...current,
              currentSrc: `${src}?retry=${newRetryCount}`,
              retryCount: newRetryCount,
              hasError: false
            }));
          }, retryDelay * newRetryCount);

          return { ...prev, retryCount: newRetryCount, isLoading: true };
        } else {
          // Max retries reached
          onError?.();
          return { ...prev, hasError: true, isLoading: false };
        }
      });
    };

    // Clean up retry timeout
    useEffect(() => {
      return () => {
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
        }
      };
    }, []);

    // Calculate container style
    const containerStyle: React.CSSProperties = {
      position: fill ? 'relative' : undefined,
      width: fill ? '100%' : width,
      height: fill ? '100%' : height,
      aspectRatio: aspectRatio ? aspectRatio.toString() : undefined
    };

    // Show fallback if error and no more retries
    if (state.hasError && state.retryCount > retryAttempts) {
      if (fallback) {
        return (
          <div
            ref={ref}
            className={cn('relative overflow-hidden', className)}
            style={containerStyle}
            {...props}
          >
            <Image
              src={fallback}
              alt={`${alt} (fallback)`}
              fill={fill}
              width={!fill ? width : undefined}
              height={!fill ? height : undefined}
              sizes={sizes}
              quality={quality}
              className="object-cover"
              style={{ objectFit }}
            />
          </div>
        );
      }

      // Default error state
      return (
        <div
          ref={ref}
          className={cn(
            'relative flex items-center justify-center bg-gray-200 text-gray-500',
            className
          )}
          style={containerStyle}
          {...props}
        >
          <div className="text-center p-4">
            <svg
              className="mx-auto h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-2 text-sm">Image failed to load</p>
          </div>
        </div>
      );
    }

    // Don't render anything if not in view and not priority
    if (!state.isInView && !priority) {
      return (
        <div
          ref={containerRef}
          className={cn('relative', className)}
          style={containerStyle}
          {...props}
        >
          {showLoadingSpinner && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-pulse bg-gray-200 h-full w-full" />
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn('relative overflow-hidden', className)}
        style={containerStyle}
        {...props}
      >
        <div ref={containerRef}>
          {/* Modern formats with fallback */}
          <picture>
            {/* AVIF format for modern browsers */}
            {enableAVIF && (
              <source
                srcSet={generateOptimizedSrc(state.currentSrc, 'avif')}
                type="image/avif"
                sizes={sizes}
              />
            )}

            {/* WebP format for supported browsers */}
            {enableWebP && (
              <source
                srcSet={generateOptimizedSrc(state.currentSrc, 'webp')}
                type="image/webp"
                sizes={sizes}
              />
            )}

            {/* Fallback to original format */}
            <Image
              src={state.currentSrc}
              alt={alt}
              fill={fill}
              width={!fill ? width : undefined}
              height={!fill ? height : undefined}
              sizes={sizes}
              priority={priority}
              loading={loading}
              quality={quality}
              placeholder={placeholder}
              blurDataURL={blurDataURL}
              onLoadingComplete={handleLoadingComplete}
              onError={handleError}
              className="transition-opacity duration-300"
              style={{
                objectFit,
                opacity: state.isLoading ? 0.7 : 1
              }}
            />
          </picture>
        </div>

        {/* Loading spinner */}
        {state.isLoading && showLoadingSpinner && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600" />
          </div>
        )}

        {/* Retry indicator */}
        {state.retryCount > 0 && state.retryCount <= retryAttempts && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
            Retry {state.retryCount}/{retryAttempts}
          </div>
        )}
      </div>
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';

// Image gallery component with optimized loading
export interface ImageGalleryProps {
  images: Array<{
    src: string
    alt: string
    caption?: string
  }>
  className?: string
  imageClassName?: string
  priority?: boolean
  quality?: number
  sizes?: string
  columns?: number
  gap?: number
}

export function ImageGallery({
  images,
  className,
  imageClassName,
  priority = false,
  quality = 75,
  sizes = '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw',
  columns = 4,
  gap = 4
}: ImageGalleryProps) {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  };

  return (
    <div
      className={cn('grid', className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap * 0.25}rem`
      }}
    >
      {images.map((image, index) => (
        <div key={index} className="relative group">
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            aspectRatio={1}
            sizes={sizes}
            priority={priority && index < 4} // Prioritize first 4 images
            quality={quality}
            className={cn('rounded-lg overflow-hidden', imageClassName)}
            onLoadingComplete={() => handleImageLoad(index)}
            showLoadingSpinner={!loadedImages.has(index)}
            enableWebP
            enableAVIF
          />

          {image.caption && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <p className="text-white text-sm font-medium">
                {image.caption}
              </p>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
      ))}
    </div>
  );
}

// Progressive image loader hook
export function useProgressiveImage(
  lowQualitySrc: string,
  highQualitySrc: string,
  delayMs: number = 100
) {
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const img = new window.Image();
      img.onload = () => {
        setCurrentSrc(highQualitySrc);
        setIsLoading(false);
      };
      img.src = highQualitySrc;
    }, delayMs);

    return () => clearTimeout(timer);
  }, [highQualitySrc, delayMs]);

  return { src: currentSrc, isLoading };
}

export default OptimizedImage;
