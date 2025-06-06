# AI-Exporter

A browser extension that lets you export AI conversations from platforms like Claude, ChatGPT, and Gemini with preserved formatting.

Check out an example output here: [EXAMPLE](EXAMPLE.md)

## Features

- Export conversations to Markdown, HTML, or plain text
- Preserves formatting, including code blocks, lists, and headings
- Works with Claude AI (support for more platforms coming soon)
- Open-source and community-driven

## Installation

### Firefox

- To be Updated

### Chrome / Edge / Brave

- No Chromium based browser support yet :(

### Manual Installation

1. Download this repository
2. For Firefox:
   - Go to `about:debugging`
   - Click "This Firefox"
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file
3. For Chrome/Edge/Brave:
   - No Chromium based browser support yet :(

## Usage

1. Visit a supported AI platform (currently Claude.ai)
2. Click the AI-Exporter icon in your browser toolbar
3. Click "Export Conversation"
4. Choose your preferred format
5. The conversation will be downloaded to your default downloads folder

## Supported Platforms

- ✅ Claude AI
- ⏳ ChatGPT (coming soon)
- ⏳ Gemini (coming soon)
- ⏳ Bard (coming soon)
- ⏳ Deepseek (coming soon)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## TODO
- [ ] Improve the styling of the output MD file (sub-elements are in order of importance)
   - [x] Differentiate between Human and Assistant
   - [x] Headers and different levels of them
   - [x] Bullets
   - [x] Numbered lists
   - [x] Bolds/Italics
   - [x] Code Snippets
   - [x] Checkboxes
   - [x] Links
   - [ ] Tables
   - [ ] Artifacts created by AI Agent
      - [ ] Make it an option for the user
         - [ ] To download the artifact separately (Default)
         - [ ] To not download the file and just refer to it
      - [ ] Include the name of the artifact AND/OR a link to it in the MD
   - [ ] Files attached by Human
      - [ ] Make it an option for the user
         - [ ] To not download the file and just refer to it (Default behavior) 
         - [ ] To download the file separately 
      - [ ] Include the name of the file AND/OR a link to it in the MD 
   - [ ] Any other advanced/semi-advanced MD sylings
- [ ] Implement LLM Clients
   - [x] Claude (Priority)
   - [ ] ChatGPT (Priority)
   - [ ] Gemini
   - [ ] Deepseek
   - [ ] Other popular LLM clients (optional)
- [ ] Implement Chrome Compatibility
- [ ] Implement PDF output support 

## Support the Project

If you find this extension useful, consider supporting its development:

- [Buy Me a Coffee](https://buymeacoffee.com/alpkaralar)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
