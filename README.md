# Amharic to English Translator

A web-based application that translates Amharic documents to English using Google Cloud Translation API. Supports multiple file formats including TXT, PDF, and DOCX files.

## Features

- 📄 **Multi-format Support**: Upload and translate TXT, PDF, and DOCX files
- 🌐 **Google Translate Integration**: Powered by Google Cloud Translation API
- 🔄 **Real-time Translation**: Instant translation with modern web APIs
- 📱 **Responsive Design**: Works on desktop and mobile browsers
- 🛡️ **Client-side Processing**: Secure file handling without server uploads

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Amharic--to-english.git
   cd Amharic--to-english
   ```

2. **Configure Google Cloud API**
   - Get a Google Cloud Translation API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Replace `YOUR_GOOGLE_TRANSLATE_API_KEY` in `translate.js` with your actual API key

3. **Open the application**
   ```bash
   # Serve the files using a local server (recommended)
   python -m http.server 8000
   # Or use Node.js
   npx serve .
   # Or simply open index.html in your browser
   ```

4. **Start translating**
   - Open `http://localhost:8000` in your browser
   - Upload an Amharic document (TXT, PDF, or DOCX)
   - Click "Translate" to get the English translation

## Documentation

📚 **[Complete API Documentation](./API_DOCUMENTATION.md)** - Comprehensive guide to all functions, components, and usage examples

## File Structure

```
├── index.html          # Main application interface
├── translate.js        # Core translation logic and file processing
├── README.md          # Project overview and setup guide
└── API_DOCUMENTATION.md # Detailed API and function documentation
```

## Supported File Types

| Format | Description | Library Used |
|--------|-------------|--------------|
| `.txt` | Plain text files | Native File API |
| `.pdf` | PDF documents | PDF.js |
| `.docx` | Microsoft Word documents | Mammoth.js |

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **PDF Processing**: [PDF.js](https://github.com/mozilla/pdf.js/)
- **DOCX Processing**: [Mammoth.js](https://github.com/mwilliamson/mammoth.js/)
- **Translation API**: [Google Cloud Translation API v2](https://cloud.google.com/translate/docs/reference/rest/v2)

## API Key Setup

### Step-by-step Google Cloud Setup:

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the "Cloud Translation API"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the API key and replace it in `translate.js`:
   ```javascript
   const apiKey = 'YOUR_ACTUAL_API_KEY_HERE';
   ```

### Security Note
⚠️ **For production use**: Store API keys securely using environment variables or implement a server-side proxy to avoid exposing keys in client-side code.

## Usage Examples

### Basic Text Translation
```javascript
// Upload a .txt file with Amharic text: "ሰላም ዓለም"
// Result: "Hello World"
```

### PDF Document Translation
```javascript
// Upload a PDF containing Amharic text
// System extracts all text and translates it
// Displays complete English translation
```

### Programmatic Usage
```javascript
// Translate text directly
const englishText = await translateText("ሰላም ዓለም");
console.log(englishText); // "Hello World"

// Extract text from PDF
const pdfText = await extractTextFromPDF(pdfFile);
```

## Browser Compatibility

✅ **Supported Browsers:**
- Chrome 60+
- Firefox 55+ 
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Error Handling

The application handles various error scenarios:

- **No file selected**: User-friendly alert message
- **Invalid file formats**: File input restrictions prevent unsupported files
- **API errors**: Network issues, invalid keys, quota limits
- **Large files**: Memory management for PDF processing

## Performance Considerations

- **File Size**: Recommended maximum of 10MB per file
- **API Limits**: Google Translate API has usage quotas
- **Memory Usage**: Large PDFs may require additional processing time
- **Network**: Translation requires active internet connection

## Development

### Local Development Setup
```bash
# Install a simple HTTP server
npm install -g http-server

# Start the server
http-server -p 8000

# Open browser
open http://localhost:8000
```

### Code Structure
- `handleFile()`: Main orchestration function
- `extractTextFromPDF()`: PDF text extraction
- `translateText()`: Google Translate API integration
- DOM manipulation for user interface

## Support

For questions, issues, or contributions:
- 📧 Create an issue on GitHub
- 📖 Check the [API Documentation](./API_DOCUMENTATION.md)
- 🔍 Review existing issues before creating new ones

## Acknowledgments

- [Google Cloud Translation API](https://cloud.google.com/translate) for translation services
- [PDF.js](https://github.com/mozilla/pdf.js/) for PDF processing
- [Mammoth.js](https://github.com/mwilliamson/mammoth.js/) for DOCX processing