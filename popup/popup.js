document.addEventListener('DOMContentLoaded', async () => {
  console.log("1. Popup loaded");
  
  // Get elements
  const platformStatusElement = document.getElementById('platform-status');
  
  if (!platformStatusElement) {
    console.error("2a. Platform status element not found");
    return;
  }
  
  console.log("2. Found platform status element");
  platformStatusElement.textContent = 'Starting platform detection...';
  
  try {
    console.log("3. Starting initialization");
    platformStatusElement.textContent = 'Querying active tab...';
    
    // Using async/await style which is more reliable in Firefox
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    console.log(`4. Tab query completed, found ${tabs.length} tabs`);
    
    if (tabs.length === 0) {
      platformStatusElement.textContent = 'Error: Could not find current tab';
      platformStatusElement.classList.add('unsupported');
      return;
    }
    
    const tab = tabs[0];
    console.log(`5. Current tab URL: ${tab.url}`);
    
    // Simple platform detection
    let platform = 'unknown';
    if (tab.url.includes('claude.ai') || tab.url.includes('anthropic.com')) {
      platform = 'claude';
    } else if (tab.url.includes('chat.openai.com')) {
      platform = 'chatgpt';
    } else if (tab.url.includes('gemini.google.com')) {
      platform = 'gemini';
    }
    
    console.log(`6. Detected platform: ${platform}`);
    
    // Update UI based on platform
    if (platform === 'claude') {
      platformStatusElement.textContent = 'Claude detected ✓';
      platformStatusElement.classList.add('supported');
    } else if (platform === 'chatgpt' || platform === 'gemini') {
      platformStatusElement.textContent = `${platform} support coming soon`;
      platformStatusElement.classList.add('unsupported');
    } else {
      platformStatusElement.textContent = 'No supported AI platform detected';
      platformStatusElement.classList.add('unsupported');
    }
  } catch (error) {
    console.error("Error during initialization:", error);
    platformStatusElement.textContent = `Error: ${error.message}`;
    platformStatusElement.classList.add('unsupported');
  }
});
