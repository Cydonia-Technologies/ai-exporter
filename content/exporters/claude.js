// Claude-specific exporter logic
window.aiExporter = window.aiExporter || {};
window.aiExporter.exporters = window.aiExporter.exporters || {};

window.aiExporter.exporters.claude = (function() {
  // Module for exporting Claude conversations
  
  // Formatting utils reference
  const formatUtils = window.aiExporter.utils.formatting;
  
  /**
   * Main export function for Claude conversations
   * @param {string} format - Export format (markdown, html, text)
   * @return {boolean} Success status
   */
  function exportConversation(format) {
    console.log(`Starting Claude conversation export in ${format} format...`);
    
    // Find user & assistant messages
    const userMessages = Array.from(document.querySelectorAll('[data-testid="user-message"], [class*="user-message"]'));
    console.log(`Found ${userMessages.length} user messages`);
    
    const claudeSelectors = [
      '[data-testid="assistant-message"]',
      '[class*="assistant-message"]',
      '[class*="claude-message"]',
      '[class*="bot-message"]'
    ];
    
    let claudeMessages = [];
    for (const selector of claudeSelectors) {
      const found = document.querySelectorAll(selector);
      if (found.length > 0) {
        console.log(`Found ${found.length} Claude messages using selector: ${selector}`);
        claudeMessages = Array.from(found);
        break;
      }
    }
    
    // Fall back to content-based detection if needed
    if (claudeMessages.length === 0) {
      console.log("Using content-based detection for Claude messages...");
      
      const mainContent = document.querySelector('main') || document.body;
      
      claudeMessages = Array.from(mainContent.querySelectorAll('div'))
        .filter(el => {
          if (userMessages.includes(el)) return false;
          
          const text = el.innerText?.trim();
          return text && 
                 text.length > 100 &&
                 el.offsetHeight > 50;
        });
      
      console.log(`Found ${claudeMessages.length} potential Claude messages based on content`);
    }
    
    // Process messages if we found both types
    if (userMessages.length > 0 && claudeMessages.length > 0) {
      // Combine all messages
      const allMessages = [...userMessages, ...claudeMessages];
      
      // Sort by vertical position
      allMessages.sort((a, b) => {
        const aRect = a.getBoundingClientRect();
        const bRect = b.getBoundingClientRect();
        return aRect.top - bRect.top;
      });
      
      console.log(`Combined ${allMessages.length} total messages, sorted by position`);
      
      // Generate output content based on format
      let output = '';
      let filename = '';
      let mimeType = '';
      
      if (format === 'markdown') {
        output = formatUtils.generateMarkdown(allMessages, userMessages);
        filename = `ai-conversation-claude-${new Date().toISOString().split('T')[0]}.md`;
        mimeType = 'text/markdown';
      } else if (format === 'html') {
        output = formatUtils.generateHtml(allMessages, userMessages);
        filename = `ai-conversation-claude-${new Date().toISOString().split('T')[0]}.html`;
        mimeType = 'text/html';
      } else {
        // Plain text
        output = formatUtils.generatePlainText(allMessages, userMessages);
        filename = `ai-conversation-claude-${new Date().toISOString().split('T')[0]}.txt`;
        mimeType = 'text/plain';
      }
      
      // Trigger download
      formatUtils.downloadFile(output, filename, mimeType);
      return true;
    } else {
      // Fall back to visual layout approach
      return exportConversationByLayout(format);
    }
  }
  
  /**
   * Visual layout-based fallback approach for Claude conversations
   * @param {string} format - Export format (markdown, html, text)
   * @return {boolean} Success status
   */
  function exportConversationByLayout(format) {
    console.log(`Starting visual layout-based export in ${format} format...`);
    
    // Get the main content area
    const mainContent = document.querySelector('main') || document.body;
    
    // Find all substantial text blocks
    const allBlocks = Array.from(mainContent.querySelectorAll('div'))
      .filter(el => {
        // Keep only visible elements with content
        return el.offsetHeight > 20 && 
               el.offsetWidth > 100 &&
               el.innerText?.trim().length > 20;
      });
    
    console.log(`Found ${allBlocks.length} visible content blocks`);
    
    // Sort by vertical position (top to bottom)
    allBlocks.sort((a, b) => {
      const aRect = a.getBoundingClientRect();
      const bRect = b.getBoundingClientRect();
      return aRect.top - bRect.top;
    });
    
    // Group blocks that are visually close to each other
    const messages = [];
    let currentGroup = [];
    let lastBottom = -1000;
    
    for (const block of allBlocks) {
      const rect = block.getBoundingClientRect();
      
      if (rect.top - lastBottom > 30) {
        if (currentGroup.length > 0) {
          messages.push(currentGroup);
        }
        currentGroup = [block];
      } else {
        currentGroup.push(block);
      }
      
      lastBottom = rect.bottom;
    }
    
    // Add the last group
    if (currentGroup.length > 0) {
      messages.push(currentGroup);
    }
    
    console.log(`Grouped into ${messages.length} potential messages`);
    
    // Generate output content based on format
    let output = '';
    let filename = '';
    let mimeType = '';
    
    if (format === 'markdown') {
      output = formatUtils.generateMarkdownFromGroups(messages);
      filename = `ai-conversation-claude-${new Date().toISOString().split('T')[0]}.md`;
      mimeType = 'text/markdown';
    } else if (format === 'html') {
      output = formatUtils.generateHtmlFromGroups(messages);
      filename = `ai-conversation-claude-${new Date().toISOString().split('T')[0]}.html`;
      mimeType = 'text/html';
    } else {
      // Plain text
      output = formatUtils.generatePlainTextFromGroups(messages);
      filename = `ai-conversation-claude-${new Date().toISOString().split('T')[0]}.txt`;
      mimeType = 'text/plain';
    }
    
    // Trigger download
    formatUtils.downloadFile(output, filename, mimeType);
    return true;
  }
  window.aiExporter.registerModule('claude');
  
  // Export module public methods
  return {
    exportConversation: exportConversation
  };
})();
