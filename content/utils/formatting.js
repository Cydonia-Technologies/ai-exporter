// Formatting utilities for AI conversation exports
window.aiExporter = window.aiExporter || {};
window.aiExporter.utils = window.aiExporter.utils || {};

window.aiExporter.utils.formatting = (function() {
  /**
   * Generate Markdown format from message elements
   * @param {Array} allMessages - All message elements
   * @param {Array} userMessages - User message elements
   * @return {string} Markdown formatted text
   */
  function generateMarkdown(allMessages, userMessages) {
    let output = '# AI Conversation Export\n\n';
    
    allMessages.forEach(msg => {
      // Determine if user message
      const isUserMessage = userMessages.includes(msg) || 
                           msg.getAttribute('data-testid') === 'user-message' || 
                           (msg.getAttribute('class') || '').includes('user');
      
      // Use bold for speaker labels instead of headers to avoid conflicts
      const sender = isUserMessage ? '**Human:**' : '**Assistant:**';
      
      // Get HTML content to preserve formatting better
      let content = '';
      
      // Try to get the actual DOM content to preserve formatting
      // Clone the node to avoid modifying the actual page
      const msgClone = msg.cloneNode(true);
      
      // Find code blocks and ensure they're properly formatted
      const codeBlocks = msgClone.querySelectorAll('pre, code');
      codeBlocks.forEach(codeBlock => {
        // Preserve code block formatting
        // Replace the code block with properly formatted markdown code block
        const language = codeBlock.className.replace('language-', '').replace(/^lang-/, '').trim() || '';
        const codeContent = codeBlock.innerText;
        
        // Create a properly formatted markdown code block
        const markdownCodeBlock = '```' + language + '\n' + codeContent + '\n```';
        
        // If it's a <pre><code> structure, replace the pre element
        if (codeBlock.tagName.toLowerCase() === 'code' && codeBlock.parentNode.tagName.toLowerCase() === 'pre') {
          codeBlock.parentNode.outerHTML = markdownCodeBlock;
        } else {
          // Otherwise just replace the code element itself
          codeBlock.outerHTML = markdownCodeBlock;
        }
      });
      
      // Get the text content which now has proper markdown code blocks
      content = msgClone.innerText.trim();
      
      // Fix heading levels to avoid conflict with speaker labels
      content = content.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, title) => {
        // Keep the same heading level but ensure it's properly formatted
        return hashes + ' ' + title;
      });
      
      // Add to output with a blank line between speaker and content
      output += `${sender}\n\n${content}\n\n---\n\n`;
    });
    
    return output;
  }
  
  /**
   * Generate Markdown from grouped elements
   * @param {Array} messages - Groups of message elements
   * @return {string} Markdown formatted text
   */
  function generateMarkdownFromGroups(messages) {
    let output = '# AI Conversation Export\n\n';
    
    messages.forEach((group, index) => {
      const firstElement = group[0];
      const rect = firstElement.getBoundingClientRect();
      
      const isUserMessage = 
        rect.left > window.innerWidth / 2 || 
        (firstElement.getAttribute('class') || '').includes('user') ||
        index % 2 === 0;
      
      // Use bold for speaker labels instead of headers
      const sender = isUserMessage ? '**Human:**' : '**Assistant:**';
      
      // Process each element in the group to preserve formatting
      let content = '';
      
      group.forEach(el => {
        // Clone the element to avoid modifying the page
        const elClone = el.cloneNode(true);
        
        // Handle code blocks
        const codeBlocks = elClone.querySelectorAll('pre, code');
        codeBlocks.forEach(codeBlock => {
          const language = codeBlock.className.replace('language-', '').replace(/^lang-/, '').trim() || '';
          const codeContent = codeBlock.innerText;
          const markdownCodeBlock = '```' + language + '\n' + codeContent + '\n```';
          
          if (codeBlock.tagName.toLowerCase() === 'code' && codeBlock.parentNode.tagName.toLowerCase() === 'pre') {
            codeBlock.parentNode.outerHTML = markdownCodeBlock;
          } else {
            codeBlock.outerHTML = markdownCodeBlock;
          }
        });
        
        // Append the element's content
        if (content) content += '\n\n';
        content += elClone.innerText.trim();
      });
      
      // Add to output with a separator
      output += `${sender}\n\n${content}\n\n---\n\n`;
    });
    
    return output;
  }
  
  /**
   * Generate HTML format from message elements
   * @param {Array} allMessages - All message elements
   * @param {Array} userMessages - User message elements
   * @return {string} HTML formatted text
   */
  function generateHtml(allMessages, userMessages) {
    let output = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Conversation Export</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      text-align: center;
      margin-bottom: 30px;
    }
    .message {
      margin-bottom: 25px;
      padding-bottom: 25px;
      border-bottom: 1px solid #eee;
    }
    .sender {
      font-weight: bold;
      margin-bottom: 10px;
    }
    .human {
      color: #2962FF;
    }
    .assistant {
      color: #6e56cf;
    }
    .content {
      white-space: pre-wrap;
    }
    pre {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
    }
    code {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    }
  </style>
</head>
<body>
  <h1>AI Conversation Export</h1>
`;
    
    allMessages.forEach(msg => {
      // Determine if user message
      const isUserMessage = userMessages.includes(msg) || 
                           msg.getAttribute('data-testid') === 'user-message' || 
                           (msg.getAttribute('class') || '').includes('user');
      
      const senderClass = isUserMessage ? 'human' : 'assistant';
      const senderText = isUserMessage ? 'Human' : 'Assistant';
      
      // Clone the node to preserve formatting
      const msgClone = msg.cloneNode(true);
      
      // Convert code blocks to HTML
      const codeBlocks = msgClone.querySelectorAll('pre, code');
      codeBlocks.forEach(codeBlock => {
        const language = codeBlock.className.replace('language-', '').replace(/^lang-/, '').trim() || '';
        const codeContent = codeBlock.innerText;
        
        // Create HTML code block
        const htmlCodeBlock = `<pre><code${language ? ` class="language-${language}"` : ''}>${escapeHtml(codeContent)}</code></pre>`;
        
        if (codeBlock.tagName.toLowerCase() === 'code' && codeBlock.parentNode.tagName.toLowerCase() === 'pre') {
          codeBlock.parentNode.outerHTML = htmlCodeBlock;
        } else {
          codeBlock.outerHTML = htmlCodeBlock;
        }
      });
      
      // Get content
      let content = msgClone.innerText.trim();
      
      // Add message to output
      output += `  <div class="message">
    <div class="sender ${senderClass}">${senderText}:</div>
    <div class="content">${content}</div>
  </div>
`;
    });
    
    output += `</body>
</html>`;
    
    return output;
  }
  
  /**
   * Generate HTML from grouped elements
   * @param {Array} messages - Groups of message elements
   * @return {string} HTML formatted text
   */
  function generateHtmlFromGroups(messages) {
    let output = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Conversation Export</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      text-align: center;
      margin-bottom: 30px;
    }
    .message {
      margin-bottom: 25px;
      padding-bottom: 25px;
      border-bottom: 1px solid #eee;
    }
    .sender {
      font-weight: bold;
      margin-bottom: 10px;
    }
    .human {
      color: #2962FF;
    }
    .assistant {
      color: #6e56cf;
    }
    .content {
      white-space: pre-wrap;
    }
    pre {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
    }
    code {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    }
  </style>
</head>
<body>
  <h1>AI Conversation Export</h1>
`;
    
    messages.forEach((group, index) => {
      const firstElement = group[0];
      const rect = firstElement.getBoundingClientRect();
      
      const isUserMessage = 
        rect.left > window.innerWidth / 2 || 
        (firstElement.getAttribute('class') || '').includes('user') ||
        index % 2 === 0;
      
      const senderClass = isUserMessage ? 'human' : 'assistant';
      const senderText = isUserMessage ? 'Human' : 'Assistant';
      
      let content = '';
      
      group.forEach(el => {
        // Clone the element
        const elClone = el.cloneNode(true);
        
        // Handle code blocks
        const codeBlocks = elClone.querySelectorAll('pre, code');
        codeBlocks.forEach(codeBlock => {
          const language = codeBlock.className.replace('language-', '').replace(/^lang-/, '').trim() || '';
          const codeContent = codeBlock.innerText;
          
          // Create HTML code block
          const htmlCodeBlock = `<pre><code${language ? ` class="language-${language}"` : ''}>${escapeHtml(codeContent)}</code></pre>`;
          
          if (codeBlock.tagName.toLowerCase() === 'code' && codeBlock.parentNode.tagName.toLowerCase() === 'pre') {
            codeBlock.parentNode.outerHTML = htmlCodeBlock;
          } else {
            codeBlock.outerHTML = htmlCodeBlock;
          }
        });
        
        // Append content
        if (content) content += '<br><br>';
        content += elClone.innerText.trim();
      });
      
      // Add message to output
      output += `  <div class="message">
    <div class="sender ${senderClass}">${senderText}:</div>
    <div class="content">${content}</div>
  </div>
`;
    });
    
    output += `</body>
</html>`;
    
    return output;
  }
  
  /**
   * Generate plain text format from message elements
   * @param {Array} allMessages - All message elements
   * @param {Array} userMessages - User message elements
   * @return {string} Plain text formatted text
   */
  function generatePlainText(allMessages, userMessages) {
    let output = 'AI CONVERSATION EXPORT\n\n';
    
    allMessages.forEach(msg => {
      // Determine if user message
      const isUserMessage = userMessages.includes(msg) || 
                           msg.getAttribute('data-testid') === 'user-message' || 
                           (msg.getAttribute('class') || '').includes('user');
      
      const sender = isUserMessage ? 'Human:' : 'Assistant:';
      
      // Get content with minimal formatting
      let content = msg.innerText.trim();
      
      // Add to output with simple formatting
      output += `${sender}\n\n${content}\n\n`;
      output += '------------------------\n\n';
    });
    
    return output;
  }
  
  /**
   * Generate plain text from grouped elements
   * @param {Array} messages - Groups of message elements
   * @return {string} Plain text formatted text
   */
  function generatePlainTextFromGroups(messages) {
    let output = 'AI CONVERSATION EXPORT\n\n';
    
    messages.forEach((group, index) => {
      const firstElement = group[0];
      const rect = firstElement.getBoundingClientRect();
      
      const isUserMessage = 
        rect.left > window.innerWidth / 2 || 
        (firstElement.getAttribute('class') || '').includes('user') ||
        index % 2 === 0;
      
      const sender = isUserMessage ? 'Human:' : 'Assistant:';
      
      // Combine all text content
      let content = '';
      
      group.forEach(el => {
        if (content) content += '\n\n';
        content += el.innerText.trim();
      });
      
      // Add to output with simple formatting
      output += `${sender}\n\n${content}\n\n`;
      output += '------------------------\n\n';
    });
    
    return output;
  }
  
  /**
   * Helper function to escape HTML entities
   * @param {string} text - Raw text
   * @return {string} Escaped HTML
   */
  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, m => map[m]);
  }
  
  /**
   * Download file with given content
   * @param {string} content - File content
   * @param {string} filename - Download filename
   * @param {string} mimeType - MIME type of the file
   */
  function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }
  window.aiExporter.registerModule('formatting'); 
  
  // Export module public methods
  return {
    generateMarkdown: generateMarkdown,
    generateMarkdownFromGroups: generateMarkdownFromGroups,
    generateHtml: generateHtml,
    generateHtmlFromGroups: generateHtmlFromGroups,
    generatePlainText: generatePlainText,
    generatePlainTextFromGroups: generatePlainTextFromGroups,
    escapeHtml: escapeHtml,
    downloadFile: downloadFile
  };
})();
