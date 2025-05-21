document.addEventListener('DOMContentLoaded', async () => {
  console.log("Popup loaded");
  
  // Get all UI elements
  const platformStatusElement = document.getElementById('platform-status');
  const exportBtn = document.getElementById('exportBtn');
  const formatSelect = document.getElementById('format');
  const statusElement = document.getElementById('status');
  
  if (!platformStatusElement || !exportBtn || !formatSelect || !statusElement) {
    console.error("Some UI elements not found:", {
      platformStatusElement: !!platformStatusElement,
      exportBtn: !!exportBtn,
      formatSelect: !!formatSelect,
      statusElement: !!statusElement
    });
    return;
  }
  
  console.log("All UI elements found");
  platformStatusElement.textContent = 'Detecting AI platform...';
  
  try {
    // Get the active tab
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    
    if (tabs.length === 0) {
      platformStatusElement.textContent = 'Error: Could not find current tab';
      platformStatusElement.classList.add('unsupported');
      return;
    }
    
    const tab = tabs[0];
    console.log("Current tab URL:", tab.url);
    
    // Detect platform
    let platform = 'unknown';
    if (tab.url.includes('claude.ai') || tab.url.includes('anthropic.com')) {
      platform = 'claude';
    } else if (tab.url.includes('chat.openai.com')) {
      platform = 'chatgpt';
    } else if (tab.url.includes('gemini.google.com')) {
      platform = 'gemini';
    }
    
    console.log("Detected platform:", platform);
    
    // Update UI based on platform
    if (platform === 'claude') {
      platformStatusElement.textContent = 'Claude detected ✓';
      platformStatusElement.classList.add('supported');
      exportBtn.disabled = false;
    } else if (platform === 'chatgpt' || platform === 'gemini') {
      platformStatusElement.textContent = `${platform} support coming soon`;
      platformStatusElement.classList.add('unsupported');
      exportBtn.disabled = true;
    } else {
      platformStatusElement.textContent = 'No supported AI platform detected';
      platformStatusElement.classList.add('unsupported');
      exportBtn.disabled = true;
    }
    
    // Set up export button click handler
    exportBtn.addEventListener('click', async () => {
      if (platform === 'unknown' || exportBtn.disabled) {
        statusElement.textContent = 'This platform is not yet supported';
        return;
      }
      
      statusElement.textContent = 'Exporting...';
      
      try {
        // Get the selected format
        const format = formatSelect.value;
        console.log("Selected format:", format);
        
        // Send a message to the content script instead of using executeScript
        browser.tabs.sendMessage(tab.id, {
          action: 'export',
          format: format
        }).then(response => {
          console.log("Export response:", response);
          if (response && response.success) {
            statusElement.textContent = 'Export successful!';
          } else {
            statusElement.textContent = response?.error || 'Export failed. Try again?';
          }
        }).catch(error => {
          console.error("Export error:", error);
          statusElement.textContent = 'Error: ' + error.message;
        });
      } catch (error) {
        console.error("Export error:", error);
        statusElement.textContent = 'Error: ' + error.message;
      }
    });
  } catch (error) {
    console.error("Initialization error:", error);
    platformStatusElement.textContent = 'Error: ' + error.message;
    platformStatusElement.classList.add('unsupported');
  }
});
