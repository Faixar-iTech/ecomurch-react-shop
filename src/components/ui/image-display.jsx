import React, { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';

const ImageDisplay = ({ images, alt, className, fallbackClassName }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!images || !Array.isArray(images) || images.length === 0) {
      setImageUrl('');
      return;
    }

    const fixImageData = (imgArray) => {
      // Case 1: Already valid single URL
      if (imgArray.length === 1) {
        const single = imgArray[0];
        if (single.startsWith('http') || single.startsWith('data:image/')) {
          return single;
        }
      }
      
      // Case 2: Your specific case ["data:image/jpeg", "base64,..."]
      if (imgArray.length >= 2) {
        const [mimeType, base64Data] = imgArray;
        if (mimeType && base64Data) {
          // Clean up the data
          let cleanMimeType = mimeType.trim();
          let cleanBase64 = base64Data.trim();
          
          // If mimeType doesn't have "data:" prefix, add it
          if (cleanMimeType === 'image/jpeg' || cleanMimeType === 'image/png') {
            cleanMimeType = `data:${cleanMimeType}`;
          }
          
          // Remove "base64," prefix if present
          if (cleanBase64.startsWith('base64,')) {
            cleanBase64 = cleanBase64.substring(7);
          }
          
          return `${cleanMimeType};base64,${cleanBase64}`;
        }
      }
      
      // Case 3: Try to find any valid image data
      for (const item of imgArray) {
        if (typeof item === 'string' && item.length > 100) {
          // Check if it looks like base64
          if (item.startsWith('/9j/') || item.startsWith('iVBOR') || item.includes('base64')) {
            return `data:image/jpeg;base64,${item.replace('base64,', '')}`;
          }
        }
      }
      
      return '';
    };

    const url = fixImageData(images);
    setImageUrl(url);
    setHasError(false);
  }, [images]);

  if (!imageUrl || hasError) {
    return (
      <div className={`flex flex-col items-center justify-center bg-secondary ${fallbackClassName || ''}`}>
        <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
        <span className="text-xs text-muted-foreground">No Image</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
};

export default ImageDisplay;