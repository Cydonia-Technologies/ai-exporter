// Browser API compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : browser;

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
    // Get the selected format
    const format = formatSelect.value;
    
    // Get the current tab
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    
    // Execute the script using browser.scripting (Manifest V3 approach)
    const results = await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: (format) => {
        // This function runs in the context of the web page
        if (window.aiExporter && 
            window.aiExporter.exporters && 
            window.aiExporter.exporters.claude) {
          return window.aiExporter.exporters.claude.exportConversation(format);
        }
        return false;
      },
      args: [format] // Pass the format as an argument
    });
    
    // Check the result
    if (results && results[0] && results[0].result) {
      statusElement.textContent = 'Export successful!';
    } else {
      statusElement.textContent = 'Export failed. Try again?';
    }
  } catch (error) {
    console.error('Error:', error);
    statusElement.textContent = 'Error: ' + error.message;
  }
});
