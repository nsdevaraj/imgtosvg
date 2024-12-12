/**
 * Creates a downloadable blob from SVG content
 * @param {string} svg - SVG content
 * @returns {Blob} Blob object ready for download
 */
export function createDownloadableBlob(svg) {
  return new Blob([svg], { type: 'image/svg+xml' });
}

/**
 * Triggers a file download
 * @param {Blob} blob - Blob to download
 * @param {string} filename - Name for the downloaded file
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}