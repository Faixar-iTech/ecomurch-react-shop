import React, { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';

const ImageDisplay = ({ images, alt, className, fallbackClassName }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!images || (!Array.isArray(images) && typeof images !== 'string')) {
      setImageUrl('');
      setHasError(false);
      return;
    }

    const fixImageData = () => {
      // Case 1: Already a valid URL or data URL string
      if (typeof images === 'string') {
        if (images.startsWith('http') || images.startsWith('data:image/')) {
          return images;
        }
        // If it's a base64 string without data prefix
        if (images.length > 100 && 
            (images.startsWith('/9j/') || images.startsWith('iVBOR') || 
             images.startsWith('UklGR') || images.startsWith('PHN2Zy'))) {
          return `data:image/jpeg;base64,${images}`;
        }
        return '';
      }

      // Case 2: Array of image data
      if (Array.isArray(images)) {
        // If the array contains a valid URL as first element
        const firstItem = images[0];
        if (firstItem && typeof firstItem === 'string') {
          // Check if it's already a valid URL or data URL
          if (firstItem.startsWith('http') || firstItem.startsWith('data:image/')) {
            return firstItem;
          }
          
          // Handle the specific case from your comment
          if (firstItem === 'data:image/jpeg' || firstItem === 'image/jpeg') {
            if (images.length >= 2) {
              const secondItem = images[1];
              let base64Data = secondItem;
              
              // Clean up base64 data
              if (base64Data.startsWith('base64,')) {
                base64Data = base64Data.substring(7);
              }
              
              // Ensure mime type has data: prefix
              const mimeType = firstItem.startsWith('data:') ? firstItem : `data:${firstItem}`;
              return `${mimeType};base64,${base64Data}`;
            }
          }
          
          // Handle webp data URLs
          if (firstItem === 'data:image/webp' && images.length >= 2) {
            let base64Data = images[1];
            if (base64Data.startsWith('base64,')) {
              base64Data = base64Data.substring(7);
            }
            return `${firstItem};base64,${base64Data}`;
          }
        }
        
        // Try to find any valid base64 image in the array
        for (const item of images) {
          if (typeof item === 'string' && item.length > 100) {
            // Check for various base64 image signatures
            if (item.startsWith('/9j/') || // JPEG
                item.startsWith('iVBOR') || // PNG
                item.startsWith('UklGR') || // WebP
                item.startsWith('R0lGOD') || // GIF
                item.startsWith('PHN2Zy')) { // SVG
              return `data:image/jpeg;base64,${item}`;
            }
          }
        }
      }
      
      return '';
    };

    const url = fixImageData();
    setImageUrl(url);
    setHasError(false);
  }, [images]);

  // Reset error state when images change
  useEffect(() => {
    setHasError(false);
  }, [images]);

  if (!imageUrl || hasError) {
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 ${
          fallbackClassName || 'min-h-[200px] min-w-[200px]'
        }`}
      >
        <ImageIcon className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-2" />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {alt || 'No Image Available'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt || 'Product image'}
      className={`object-cover ${className || ''}`}
      onError={() => setHasError(true)}
      loading="lazy"
      onLoad={() => setHasError(false)}
    />
  );
};

export default ImageDisplay;