import { useState, useCallback } from 'react';
import { imageToSvg } from '../utils/imageToSvg';
import { createDownloadableBlob, downloadBlob } from '../utils/fileUtils';

export function useImageConverter() {
  const [convertedSvg, setConvertedSvg] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState({
    threshold: 128,
    color: '#000000'
  });
  const [currentImage, setCurrentImage] = useState(null);

  const handleImageUpload = useCallback(async (file) => {
    try {
      setIsConverting(true);
      setError(null);
      setCurrentImage(file);  // Store the current image
      
      // Pass the file directly to imageToSvg
      const svg = await imageToSvg(file, options);
      setConvertedSvg(svg);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsConverting(false);
    }
  }, [options]);

  const handleOptionsChange = useCallback(async (newOptions) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
    
    // If we have a current image, reconvert it with new options
    if (currentImage) {
      try {
        setIsConverting(true);
        setError(null);
        const svg = await imageToSvg(currentImage, { ...options, ...newOptions });
        setConvertedSvg(svg);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsConverting(false);
      }
    }
  }, [currentImage, options]);

  const handleDownload = useCallback(() => {
    if (!convertedSvg) return;
    
    const blob = createDownloadableBlob(convertedSvg);
    downloadBlob(blob, 'converted.svg');
  }, [convertedSvg]);

  return {
    convertedSvg,
    isConverting,
    error,
    options,
    handleImageUpload,
    handleOptionsChange,
    handleDownload
  };
}