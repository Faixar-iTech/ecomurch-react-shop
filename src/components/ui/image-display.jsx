import React, { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';

const ImageDisplay = ({ images, alt, className, fallbackClassName }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!images) {
      setImageUrl('');
      setIsLoading(false);
      return;
    }

    const processImages = () => {
      try {
        console.log('Processing images input:', images);
        
        // Case 1: Single string (URL or base64)
        if (typeof images === 'string') {
          if (images.startsWith('http') || images.startsWith('https')) {
            return images; // Regular URL
          }
          if (images.startsWith('data:image/')) {
            return images; // Already data URL
          }
          // Check if it's base64 data without prefix
          if (images.startsWith('/9j/') || images.startsWith('iVBOR') || 
              images.startsWith('UklGR') || images.startsWith('R0lGOD')) {
            return `data:image/jpeg;base64,${images}`;
          }
          return ''; // Invalid string
        }

        // Case 2: Array format (your main case)
        if (Array.isArray(images)) {
          // First, check for any direct URLs in the array
          for (const item of images) {
            if (typeof item === 'string' && item.startsWith('http')) {
              return item;
            }
          }

          // Handle your specific format: ['data:image/jpeg', 'base64,...']
          if (images.length >= 2) {
            const [first, second] = images;
            
            // Ensure we have strings
            if (typeof first !== 'string' || typeof second !== 'string') {
              return '';
            }

            console.log('Processing array format:', { first, second: second.substring(0, 50) + '...' });

            // Clean the second item - remove 'base64,' prefix
            const cleanSecond = second.replace(/^base64,/, '');
            
            // Check if it's a URL (your problematic case)
            if (cleanSecond.startsWith('http')) {
              console.log('Detected URL after cleaning:', cleanSecond.substring(0, 50) + '...');
              return cleanSecond; // Return the URL directly
            }
            
            // Check if it's actual base64 data
            if (cleanSecond.startsWith('/9j/') || cleanSecond.startsWith('iVBOR') || 
                cleanSecond.startsWith('UklGR') || cleanSecond.startsWith('R0lGOD')) {
              
              // Ensure first item has proper data: prefix
              const mimeType = first.startsWith('data:') ? first : `data:${first}`;
              const result = `${mimeType};base64,${cleanSecond}`;
              console.log('Created data URL with base64');
              return result;
            }
          }

          // Try to find any base64-like string in the array
          for (const item of images) {
            if (typeof item === 'string' && item.length > 100) {
              if (item.startsWith('/9j/') || item.startsWith('iVBOR') || 
                  item.startsWith('UklGR') || item.startsWith('R0lGOD')) {
                return `data:image/jpeg;base64,${item}`;
              }
            }
          }
        }

        return '';
      } catch (error) {
        console.error('Error processing image data:', error);
        return '';
      }
    };

    const url = processImages();
    console.log('Final URL:', url ? url.substring(0, 100) + '...' : 'No valid image found');
    
    setImageUrl(url);
    setHasError(false);
    setIsLoading(false);
  }, [images]);

  const handleError = (e) => {
    console.error('Image load failed:', imageUrl?.substring(0, 100) + '...');
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    console.log('Image loaded successfully');
    setHasError(false);
    setIsLoading(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-gray-100 animate-pulse rounded-lg ${
          fallbackClassName || 'w-full h-64'
        }`}
      >
        <div className="h-12 w-12 rounded-full bg-gray-300 mb-2"></div>
        <div className="h-4 w-24 bg-gray-300 rounded"></div>
      </div>
    );
  }

  // Show fallback on error or no image
  if (!imageUrl || hasError) {
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-gray-100 rounded-lg ${
          fallbackClassName || 'w-full h-64'
        }`}
      >
        <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
        <span className="text-sm text-gray-500">
          {alt || 'No image available'}
        </span>
      </div>
    );
  }

  // Show the image
  return (
    <img
      src={imageUrl}
      alt={alt || 'Product image'}
      className={`${className || 'w-full h-auto object-cover'}`}
      onError={handleError}
      onLoad={handleLoad}
      loading="lazy"
    />
  );
};

export default ImageDisplay;