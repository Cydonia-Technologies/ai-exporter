// Loader script that ensures all modules are loaded in the correct order
// This should be the first script referenced in the manifest.json content_scripts

(function() {
  console.log('AI-Exporter: Initializing global namespace');
  
  // Initialize global namespace for the extension
  window.aiExporter = window.aiExporter || {};
  window.aiExporter.utils = window.aiExporter.utils || {};
  window.aiExporter.exporters = window.aiExporter.exporters || {};
  
  // Register the module loaded status
  const modulesLoaded = {
    platformDetection: false,
    formatting: false,
    claude: false
  };
  
  // Function to check if all required modules are loaded
  function checkAllModulesLoaded() {
    for (const module in modulesLoaded) {
      if (!modulesLoaded[module]) {
        return false;
      }
    }
    return true;
  }
  
  // Module registration function
  window.aiExporter.registerModule = function(moduleName) {
    if (moduleName in modulesLoaded) {
      modulesLoaded[moduleName] = true;
      console.log(`AI-Exporter: Module '${moduleName}' loaded successfully`);
    }
    
    // If all modules are loaded, we can proceed with initialization
    if (checkAllModulesLoaded()) {
      console.log('AI-Exporter: All modules loaded, ready for export operations');
    }
  };
})();
