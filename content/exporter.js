// Main exporter script that coordinates platform detection and export process
(function() {
  console.log('AI-Exporter: Starting export process');
  
  // Import necessary modules
  const platformUtils = window.aiExporter.utils.platformDetection;
  const formatUtils = window.aiExporter.utils.formatting;
  
  // Get format preference (set by popup.js)
  const format = window.aiExporterFormat || 'markdown';
  
  // Detect which platform we're on
  const platform = platformUtils.detectPlatform();
  
  console.log(`AI-Exporter: Detected platform: ${platform}`);
  
  // Function for exporting based on user request
  window.aiExporter.performExport = function(format) {
    console.log(`AI-Exporter: User requested export in ${format} format`); 
    // Execute the appropriate exporter based on platform
    if (platform === 'claude') {
      // Import Claude exporter dynamically
      const claudeExporter = window.aiExporter.exporters.claude;
      return claudeExporter.exportConversation(format);
    } else if (platform === 'chatgpt') {
      // ChatGPT support placeholder
      alert('AI-Exporter: ChatGPT support coming soon!');
      return false;
    } else if (platform === 'gemini') {
      // Gemini support placeholder
      alert('AI-Exporter: Gemini support coming soon!');
      return false;
    } else {
      alert(`AI-Exporter: ${platform} is not yet supported. Coming soon!`);
      return false;
    }
  };
  
  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("AI-Exporter: Message received:", request);
    
    if (request.action === 'export') {
      try {
        // Call the export function
        const result = window.aiExporter.performExport(request.format);
        return Promise.resolve({ success: !!result });
      } catch (error) {
        console.error("AI-Exporter: Export error:", error);
        return Promise.resolve({ success: false, error: error.message });
      }
    }
    
    return false;
  });
  
  console.log('AI-Exporter: Ready to receive export requests');
})();
