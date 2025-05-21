// Browser API compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

document.addEventListener('DOMContentLoaded', async () => {
  const exportBtn = document.getElementById('exportBtn');
  const formatSelect = document.getElementById('format');
  const statusElement = document.getElementById('status');
  const platformStatusElement = document.getElementById('platform-status');
  
  // Get the current tab to check what platform we're on
  const [tab] = await browserAPI.tabs.query({ active: true, currentWindow: true });
  const url = new URL(tab.url);
  
  // Detect which AI platform we're on
  let platform = 'unknown';
  if (url.hostname.includes('claude.ai') || url.hostname.includes('anthropic.com')) {
    platform = 'claude';
    platformStatusElement.textContent = 'Claude detected ✓';
    platformStatusElement.classList.add('supported');
    exportBtn.disabled = false;
  } else if (url.hostname.includes('chat.openai.com')) {
    platform = 'chatgpt';
    platformStatusElement.textContent = 'ChatGPT support coming soon';
    platformStatusElement.classList.add('unsupported');
    exportBtn.disabled = true;
  } else if (url.hostname.includes('gemini.google.com')) {
    platform = 'gemini';
    platformStatusElement.textContent = 'Gemini support coming soon';
    platformStatusElement.classList.add('unsupported');
    exportBtn.disabled = true;
  } else {
    platformStatusElement.textContent = 'No supported AI platform detected';
    platformStatusElement.classList.add('unsupported');
    exportBtn.disabled = true;
  }
  
  // Export button click handler
  exportBtn.addEventListener('click', async () => {
    if (platform === 'unknown' || exportBtn.disabled) {
      statusElement.textContent = 'This platform is not yet supported';
      return;
    }
    
    statusElement.textContent = 'Exporting...';
    
    try {
      // Pass the selected format to the content script
      const format = formatSelect.value;
      
      // Execute content script to perform the export
      const result = await browserAPI.tabs.executeScript(tab.id, {
        code: `
          // Inject the format parameter
          window.aiExporterFormat = "${format}";
          // The actual script will be injected after this
        `
      });
      
      // Execute the main exporter by calling a function that should already be injected
      const exportResult = await browserAPI.tabs.executeScript(tab.id, {
      code: 'window.aiExporter ? window.aiExporter.exporters.claude.exportConversation("' + format + '") : false;'
      });
      
      if (exportResult && exportResult[0]) {
        statusElement.textContent = 'Export successful!';
      } else {
        statusElement.textContent = 'Export failed. Try again?';
      }
    } catch (error) {
      console.error('Error executing content script:', error);
      statusElement.textContent = 'Error: ' + error.message;
    }
  });
  
  // Update contribute and support links
  document.getElementById('contributeBtn').href = "https://github.com/yourusername/ai-exporter";
  document.getElementById('supportBtn').href = "https://buymeacoffee.com/yourusername";
});
