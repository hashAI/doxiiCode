/**
 * Utility functions for programming language detection and handling
 */

export type SupportedLanguage = 
  | 'html'
  | 'css' 
  | 'javascript'
  | 'typescript'
  | 'json'
  | 'markdown'
  | 'yaml'
  | 'xml'
  | 'plaintext';

/**
 * Language mapping for file extensions
 */
const EXTENSION_TO_LANGUAGE: Record<string, SupportedLanguage> = {
  // Web languages
  html: 'html',
  htm: 'html',
  css: 'css',
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  json: 'json',
  
  // Markup languages  
  md: 'markdown',
  markdown: 'markdown',
  yml: 'yaml',
  yaml: 'yaml',
  xml: 'xml',
  
  // Fallback
  txt: 'plaintext',
};

/**
 * Detect programming language from filename
 * @param filename - The filename to analyze
 * @returns The detected language, defaulting to 'html'
 */
export function getLanguageFromFilename(filename: string): SupportedLanguage {
  if (!filename) return 'html';
  
  const extension = filename.split('.').pop()?.toLowerCase();
  if (!extension) return 'html';
  
  return EXTENSION_TO_LANGUAGE[extension] || 'html';
}

/**
 * Detect language from file content (basic heuristics)
 * @param content - File content to analyze
 * @returns Detected language or null if uncertain
 */
export function getLanguageFromContent(content: string): SupportedLanguage | null {
  if (!content || content.trim().length === 0) return null;
  
  const trimmed = content.trim();
  
  // HTML detection
  if (trimmed.startsWith('<!DOCTYPE') || 
      trimmed.startsWith('<html') ||
      /<\/?(html|head|body|div|span|p|h[1-6])/i.test(trimmed)) {
    return 'html';
  }
  
  // JSON detection
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch {
      // Not valid JSON
    }
  }
  
  // CSS detection
  if (/[a-zA-Z-]+\s*:\s*[^;]+;/.test(trimmed) ||
      /\{[^}]*\}/.test(trimmed) ||
      /@(import|media|keyframes)/.test(trimmed)) {
    return 'css';
  }
  
  // JavaScript/TypeScript detection
  if (/\b(const|let|var|function|class|import|export|interface|type)\b/.test(trimmed) ||
      /=>\s*[{(]/.test(trimmed) ||
      /console\.(log|error|warn)/.test(trimmed)) {
    
    // TypeScript specific patterns
    if (/:\s*(string|number|boolean|object|any|void)/.test(trimmed) ||
        /\binterface\b/.test(trimmed) ||
        /<[A-Z][^>]*>/.test(trimmed)) {
      return 'typescript';
    }
    
    return 'javascript';
  }
  
  return null;
}

/**
 * Get the best language detection for a file
 * @param filename - The filename (can be empty)
 * @param content - The file content (can be empty)
 * @returns The detected language, with filename taking precedence over content
 */
export function detectLanguage(filename?: string, content?: string): SupportedLanguage {
  // Filename takes precedence if available
  if (filename) {
    const langFromFilename = getLanguageFromFilename(filename);
    if (langFromFilename !== 'html') { // Only use default 'html' as fallback
      return langFromFilename;
    }
  }
  
  // Try content detection if filename didn't give a clear result
  if (content) {
    const langFromContent = getLanguageFromContent(content);
    if (langFromContent) {
      return langFromContent;
    }
  }
  
  // Default to HTML for web context
  return 'html';
}

/**
 * Get display name for a language
 */
export function getLanguageDisplayName(language: SupportedLanguage): string {
  const displayNames: Record<SupportedLanguage, string> = {
    html: 'HTML',
    css: 'CSS',
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    json: 'JSON',
    markdown: 'Markdown',
    yaml: 'YAML',
    xml: 'XML',
    plaintext: 'Plain Text',
  };
  
  return displayNames[language] || language.toUpperCase();
}

/**
 * Check if a language supports live preview
 */
export function supportsLivePreview(language: SupportedLanguage): boolean {
  return ['html', 'css', 'javascript'].includes(language);
}