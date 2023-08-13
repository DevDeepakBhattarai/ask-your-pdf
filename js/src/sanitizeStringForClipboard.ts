export function sanitizeStringForClipboard(input: string): string {
  const forbiddenChars = /[^\x20-\x7E\r\n]/g;
  const sanitizedString = input.replace(forbiddenChars, "");
  const longStringRegex = /\s{3,}/g;
  sanitizedString.replaceAll(longStringRegex, " ");
  return sanitizedString;
}
