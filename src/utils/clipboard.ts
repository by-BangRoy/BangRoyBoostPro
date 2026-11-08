/**
 * Safe clipboard copy utility with fallback for iframes and restricted environments.
 */
export async function safeCopy(text: string): Promise<boolean> {
  if (!text) return false;

  // 1. Try modern clipboard API if available and document is focused
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn('Modern navigator.clipboard.writeText failed, using textarea fallback', err);
  }

  // 2. Fallback to execCommand('copy') via temporary textarea
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, 99999);
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('All copy strategies failed', err);
    return false;
  }
}
