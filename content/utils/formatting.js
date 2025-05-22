// Enhanced formatting utilities for AI conversation exports
window.aiExporter = window.aiExporter || {};
window.aiExporter.utils = window.aiExporter.utils || {};

window.aiExporter.utils.formatting = (function() {
  /**
   * Convert HTML element to markdown with proper formatting
   * @param {Element} element - DOM element to convert
   * @return {string} Markdown formatted text
   */
  function htmlToMarkdown(element) {
    // Clone the element to avoid modifying the original
    const clone = element.cloneNode(true);
    
    // Process specific HTML elements and convert to markdown
    processElement(clone);
    
    // Get the final text content
    return clone.textContent || clone.innerText || '';
  }
  
  /**
   * Recursively process DOM elements and convert to markdown
   * @param {Element} element - Element to process
   */
  function processElement(element) {
    // Handle different types of elements
    const tagName = element.tagName?.toLowerCase();
    
    switch (tagName) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        convertHeading(element);
        break;
      case 'strong':
      case 'b':
        convertBold(element);
        break;
      case 'em':
      case 'i':
        convertItalic(element);
        break;
      case 'code':
        convertInlineCode(element);
        break;
      case 'pre':
        convertCodeBlock(element);
        break;
      case 'ul':
        convertUnorderedList(element);
        break;
      case 'ol':
        convertOrderedList(element);
        break;
      case 'li':
        // List items are handled by their parent ul/ol
        break;
      case 'blockquote':
        convertBlockquote(element);
        break;
      case 'a':
        convertLink(element);
        break;
      case 'table':
        convertTable(element);
        break;
      case 'br':
        element.textContent = '\n';
        break;
      case 'hr':
        element.textContent = '\n---\n';
        break;
      default:
        // For other elements, just process their children
        processChildren(element);
        break;
    }
  }
  
  /**
   * Process all child elements
   * @param {Element} element - Parent element
   */
  function processChildren(element) {
    const children = Array.from(element.children);
    children.forEach(child => processElement(child));
  }
  
  /**
   * Convert heading elements to markdown
   * @param {Element} element - Heading element
   */
  function convertHeading(element) {
    const level = parseInt(element.tagName.charAt(1));
    const hashes = '#'.repeat(level);
    const text = element.textContent || element.innerText || '';
    element.textContent = `${hashes} ${text.trim()}`;
  }
  
  /**
   * Convert bold elements to markdown
   * @param {Element} element - Bold element
   */
  function convertBold(element) {
    processChildren(element);
    const text = element.textContent || element.innerText || '';
    element.textContent = `**${text.trim()}**`;
  }
  
  /**
   * Convert italic elements to markdown
   * @param {Element} element - Italic element
   */
  function convertItalic(element) {
    processChildren(element);
    const text = element.textContent || element.innerText || '';
    element.textContent = `*${text.trim()}*`;
  }
  
  /**
   * Convert inline code elements to markdown
   * @param {Element} element - Code element
   */
  function convertInlineCode(element) {
    // Don't process if this is inside a pre element (code block)
    if (element.closest('pre')) {
      return;
    }
    
    const text = element.textContent || element.innerText || '';
    element.textContent = `\`${text}\``;
  }
  
  /**
   * Convert code block elements to markdown
   * @param {Element} element - Pre element
   */
  function convertCodeBlock(element) {
    const codeElement = element.querySelector('code');
    const text = (codeElement || element).textContent || (codeElement || element).innerText || '';
    
    // Try to detect language from class names
    let language = '';
    const classNames = (codeElement || element).className;
    if (classNames) {
      const langMatch = classNames.match(/(?:language-|lang-)([a-zA-Z0-9]+)/);
      if (langMatch) {
        language = langMatch[1];
      }
    }
    
    element.textContent = `\`\`\`${language}\n${text}\n\`\`\``;
  }
  
  /**
   * Convert unordered list to markdown
   * @param {Element} element - UL element
   */
  function convertUnorderedList(element) {
    const items = Array.from(element.querySelectorAll('li'));
    let result = '';
    
    items.forEach((item, index) => {
      // Process children of the list item first
      processChildren(item);
      
      const text = item.textContent || item.innerText || '';
      const trimmedText = text.trim();
      
      if (trimmedText) {
        // Check if this looks like a checkbox/todo item
        const isCheckbox = trimmedText.match(/^[\[\(][\s\u00A0]*[x✓\u2713\u2714]?[\s\u00A0]*[\]\)]/i);
        
        if (isCheckbox) {
          // Convert to markdown checkbox format
          const isChecked = /[x✓\u2713\u2714]/i.test(isCheckbox[0]);
          const cleanText = trimmedText.replace(/^[\[\(][\s\u00A0]*[x✓\u2713\u2714]?[\s\u00A0]*[\]\)][\s\u00A0]*/, '').trim();
          result += `- [${isChecked ? 'x' : ' '}] ${cleanText}`;
        } else {
          result += `- ${trimmedText}`;
        }
        
        if (index < items.length - 1) {
          result += '\n';
        }
      }
    });
    
    element.textContent = result;
  }
  
  /**
   * Convert ordered list to markdown
   * @param {Element} element - OL element
   */
  function convertOrderedList(element) {
    const items = Array.from(element.querySelectorAll('li'));
    let result = '';
    
    items.forEach((item, index) => {
      // Process children of the list item first
      processChildren(item);
      
      const text = item.textContent || item.innerText || '';
      const trimmedText = text.trim();
      
      if (trimmedText) {
        result += `${index + 1}. ${trimmedText}`;
        if (index < items.length - 1) {
          result += '\n';
        }
      }
    });
    
    element.textContent = result;
  }
  
  /**
   * Convert blockquote to markdown
   * @param {Element} element - Blockquote element
   */
  function convertBlockquote(element) {
    processChildren(element);
    const text = element.textContent || element.innerText || '';
    const lines = text.split('\n');
    const quotedLines = lines.map(line => `> ${line.trim()}`).join('\n');
    element.textContent = quotedLines;
  }
  
  /**
   * Convert link to markdown
   * @param {Element} element - Anchor element
   */
  function convertLink(element) {
    processChildren(element);
    const text = element.textContent || element.innerText || '';
    const href = element.getAttribute('href') || '';
    
    if (href && text.trim()) {
      element.textContent = `[${text.trim()}](${href})`;
    }
  }
  
  /**
   * Convert table to markdown
   * @param {Element} element - Table element
   */
  function convertTable(element) {
    const rows = Array.from(element.querySelectorAll('tr'));
    let result = '';
    
    rows.forEach((row, rowIndex) => {
      const cells = Array.from(row.querySelectorAll('td, th'));
      const cellTexts = cells.map(cell => {
        processChildren(cell);
        return (cell.textContent || cell.innerText || '').trim();
      });
      
      if (cellTexts.length > 0) {
        result += '| ' + cellTexts.join(' | ') + ' |';
        
        // Add header separator after first row
        if (rowIndex === 0) {
          result += '\n| ' + cells.map(() => '---').join(' | ') + ' |';
        }
        
        if (rowIndex < rows.length - 1) {
          result += '\n';
        }
      }
    });
    
    element.textContent = result;
  }
  
  /**
   * Enhanced Generate Markdown format from message elements
   * @param {Array} allMessages - All message elements
   * @param {Array} userMessages - User message elements
   * @return {string} Markdown formatted text
   */
  function generateMarkdown(allMessages, userMessages) {
    let output = '# AI Conversation Export\n\n';
    
    allMessages.forEach((msg, index) => {
      // Determine if user message
      const isUserMessage = userMessages.includes(msg) || 
                           msg.getAttribute('data-testid') === 'user-message' || 
                           (msg.getAttribute('class') || '').includes('user');
      
      // Use bold for speaker labels
      const sender = isUserMessage ? '**Human:**' : '**Assistant:**';
      
      // Clone the message to avoid modifying the original
      const msgClone = msg.cloneNode(true);
      
      // Process the cloned message to convert HTML to markdown
      processElement(msgClone);
      
      // Get the converted content
      let content = msgClone.textContent || msgClone.innerText || '';
      content = content.trim();
      
      // Clean up any extra whitespace
      content = content.replace(/\n\s*\n\s*\n/g, '\n\n'); // Max 2 consecutive newlines
      content = content.replace(/^\s+|\s+$/g, ''); // Trim start and end
      
      // Add to output
      output += `${sender}\n\n${content}\n\n---\n\n`;
    });
    
    return output;
  }
  
  /**
   * Enhanced Generate Markdown from grouped elements
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
      
      // Use bold for speaker labels
      const sender = isUserMessage ? '**Human:**' : '**Assistant:**';
      
      // Process each element in the group
      let content = '';
      
      group.forEach(el => {
        // Clone the element to avoid modifying the page
        const elClone = el.cloneNode(true);
        
        // Process to convert HTML to markdown
        processElement(elClone);
        
        // Append the element's content
        const elementContent = (elClone.textContent || elClone.innerText || '').trim();
        if (elementContent) {
          if (content) content += '\n\n';
          content += elementContent;
        }
      });
      
      // Clean up content
      content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
      content = content.trim();
      
      // Add to output
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
      background-color: #f5f5f5;
      padding: 2px 4px;
      border-radius: 3px;
    }
    pre code {
      background-color: transparent;
      padding: 0;
    }
    blockquote {
      border-left: 4px solid #ddd;
      margin: 0;
      padding-left: 16px;
      color: #666;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 16px 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px 12px;
      text-align: left;
    }
    th {
      background-color: #f5f5f5;
      font-weight: bold;
    }
    ul, ol {
      margin: 16px 0;
      padding-left: 24px;
    }
    li {
      margin: 4px 0;
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
      
      // Get HTML content while preserving formatting
      let content = msg.innerHTML;
      
      // Clean up the HTML content
      content = cleanHtmlContent(content);
      
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
      background-color: #f5f5f5;
      padding: 2px 4px;
      border-radius: 3px;
    }
    pre code {
      background-color: transparent;
      padding: 0;
    }
    blockquote {
      border-left: 4px solid #ddd;
      margin: 0;
      padding-left: 16px;
      color: #666;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 16px 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px 12px;
      text-align: left;
    }
    th {
      background-color: #f5f5f5;
      font-weight: bold;
    }
    ul, ol {
      margin: 16px 0;
      padding-left: 24px;
    }
    li {
      margin: 4px 0;
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
        // Get HTML content
        let elementContent = el.innerHTML;
        elementContent = cleanHtmlContent(elementContent);
        
        // Append content
        if (content) content += '<br><br>';
        content += elementContent;
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
   * Clean HTML content for export
   * @param {string} html - Raw HTML content
   * @return {string} Cleaned HTML content
   */
  function cleanHtmlContent(html) {
    // Remove unwanted attributes and clean up HTML
    let cleaned = html;
    
    // Remove common unwanted attributes
    cleaned = cleaned.replace(/\s*(?:class|id|style|data-[^=]*|aria-[^=]*)="[^"]*"/gi, '');
    cleaned = cleaned.replace(/\s*(?:class|id|style|data-[^=]*|aria-[^=]*)='[^']*'/gi, '');
    
    // Remove empty elements
    cleaned = cleaned.replace(/<(\w+)[^>]*>\s*<\/\1>/g, '');
    
    // Clean up whitespace
    cleaned = cleaned.replace(/\s+/g, ' ');
    cleaned = cleaned.trim();
    
    return cleaned;
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
    downloadFile: downloadFile,
    htmlToMarkdown: htmlToMarkdown
  };
})();
