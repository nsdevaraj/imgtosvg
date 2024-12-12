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

  const handleImageUpload = useCallback(async (file) => {
    try {
      setIsConverting(true);
      setError(null);
      
      // Pass the file directly to imageToSvg
      const svg = await imageToSvg(file, options);
      setConvertedSvg(svg);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsConverting(false);
    }
  }, [options]);

  const handleOptionsChange = useCallback((newOptions) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  }, []);

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