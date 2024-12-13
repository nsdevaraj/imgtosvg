import { useState, useCallback } from 'react';
import { imageToSvg } from '../utils/imageToSvg';
import { createDownloadableBlob, downloadBlob } from '../utils/fileUtils';

export function useImageConverter() {
  const [convertedSvgs, setConvertedSvgs] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState({
    threshold: 128
  });
  const [currentImages, setCurrentImages] = useState([]);

  const handleImageUpload = useCallback(async (files) => {
    try {
      setIsConverting(true);
      setError(null);
      setCurrentImages(files);

      const svgPromises = files.map(file => imageToSvg(file, options));
      const svgs = await Promise.all(svgPromises);
      setConvertedSvgs(svgs);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsConverting(false);
    }
  }, [options]);

  const handleOptionsChange = useCallback(async (newOptions) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
    
    if (currentImages.length > 0) {
      try {
        setIsConverting(true);
        setError(null);
        const updatedOptions = { ...options, ...newOptions };
        const svgPromises = currentImages.map(image => imageToSvg(image, updatedOptions));
        const svgs = await Promise.all(svgPromises);
        setConvertedSvgs(svgs);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsConverting(false);
      }
    }
  }, [currentImages, options]);

  const handleDownload = useCallback((index) => {
    if (!convertedSvgs[index]) return;
    
    const blob = createDownloadableBlob(convertedSvgs[index], 'image/svg+xml');
    downloadBlob(blob, `converted-${index + 1}.svg`);
  }, [convertedSvgs]);

  return {
    convertedSvgs,
    isConverting,
    error,
    options,
    handleImageUpload,
    handleOptionsChange,
    handleDownload
  };
}