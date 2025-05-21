// Platform detection utilities for AI conversation exports
window.aiExporter = window.aiExporter || {};
window.aiExporter.utils = window.aiExporter.utils || {};

window.aiExporter.utils.platformDetection = (function() {
  /**
   * Detect which AI platform the current page belongs to
   * @return {string} Platform identifier ('claude', 'chatgpt', 'gemini', 'unknown')
   */
  function detectPlatform() {
    const url = window.location.hostname;
    
    if (url.includes('claude.ai') || url.includes('anthropic.com')) {
      return 'claude';
    } else if (url.includes('chat.openai.com')) {
      return 'chatgpt';
    } else if (url.includes('gemini.google.com') || url.includes('bard.google.com')) {
      return 'gemini';
    } else if (url.includes('deepseek.com')) {
      return 'deepseek';
    }
    
    return 'unknown';
  }
  
  /**
   * Get platform-specific information based on the current platform
   * @return {Object} Platform information object with name, version, etc.
   */
  function getPlatformInfo() {
    const platform = detectPlatform();
    
    switch (platform) {
      case 'claude':
        return {
          name: 'Claude',
          company: 'Anthropic',
          supported: true,
          version: detectClaudeVersion()
        };
      case 'chatgpt':
        return {
          name: 'ChatGPT',
          company: 'OpenAI',
          supported: false,
          comingSoon: true
        };
      case 'gemini':
        return {
          name: 'Gemini',
          company: 'Google',
          supported: false,
          comingSoon: true
        };
      case 'deepseek':
        return {
          name: 'DeepSeek',
          company: 'DeepSeek',
          supported: false,
          comingSoon: true
        };
      default:
        return {
          name: 'Unknown Platform',
          supported: false
        };
    }
  }
  
  /**
   * Attempt to detect which Claude version is being used
   * @return {string} Claude version or 'unknown'
   */
  function detectClaudeVersion() {
    // This is a placeholder - in a real implementation, you might
    // look for specific elements or API responses that indicate
    // which Claude version is in use (Claude 3, Claude 3.5, etc.)
    
    // Check for version indicators in the DOM
    const versionElements = document.querySelectorAll('[class*="claude-version"], [data-testid*="model-selector"]');
    
    if (versionElements.length > 0) {
      for (const el of versionElements) {
        const text = el.innerText;
        if (text.includes('3.5')) return '3.5';
        if (text.includes('3 Opus')) return '3 Opus';
        if (text.includes('3 Sonnet')) return '3 Sonnet';
        if (text.includes('3 Haiku')) return '3 Haiku';
        if (text.includes('3')) return '3';
        if (text.includes('2')) return '2';
      }
    }
    
    return 'unknown';
  }
  window.aiExporter.registerModule('platformDetection');
  
  // Export module public methods
  return {
    detectPlatform: detectPlatform,
    getPlatformInfo: getPlatformInfo
  };
})();
