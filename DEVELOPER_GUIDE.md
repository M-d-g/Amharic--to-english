# Developer Guide - Amharic to English Translator

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Code Organization](#code-organization)
3. [Function Reference](#function-reference)
4. [Implementation Examples](#implementation-examples)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

## Architecture Overview

### Application Flow

```mermaid
graph TD
    A[User selects file] --> B[handleFile() called]
    B --> C{File type check}
    C -->|.txt| D[Read as text]
    C -->|.pdf| E[extractTextFromPDF()]
    C -->|.docx| F[Mammoth.js extraction]
    D --> G[translateText()]
    E --> G
    F --> G
    G --> H[Display in output textarea]
```

### Component Architecture

```
┌─────────────────────────────────────┐
│            Frontend (HTML/CSS/JS)   │
├─────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────────┐│
│  │File Input   │ │Output Display   ││
│  │Component    │ │Component        ││
│  └─────────────┘ └─────────────────┘│
├─────────────────────────────────────┤
│           Core Functions            │
│  ┌─────────────┐ ┌─────────────────┐│
│  │handleFile() │ │translateText()  ││
│  └─────────────┘ └─────────────────┘│
│  ┌─────────────┐                   │
│  │extractText  │                   │
│  │FromPDF()    │                   │
│  └─────────────┘                   │
├─────────────────────────────────────┤
│         External Libraries          │
│  ┌─────────────┐ ┌─────────────────┐│
│  │PDF.js       │ │Mammoth.js       ││
│  └─────────────┘ └─────────────────┘│
├─────────────────────────────────────┤
│           External APIs             │
│  ┌─────────────────────────────────┐│
│  │Google Cloud Translation API     ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

## Code Organization

### File Structure Details

```
project-root/
├── index.html                 # Main UI and HTML structure
├── translate.js              # Core application logic
├── README.md                 # User-facing documentation
├── API_DOCUMENTATION.md      # Complete API reference
├── DEVELOPER_GUIDE.md        # This file - developer documentation
└── .git/                     # Git repository data
```

### translate.js Function Breakdown

```javascript
// Main functions in order of execution
handleFile()           // Entry point and orchestrator
├── File validation
├── File type detection
├── Text extraction delegation
│   ├── .txt → file.text()
│   ├── .pdf → extractTextFromPDF()
│   └── .docx → mammoth.extractRawText()
└── translateText()    // Google Translate API call

// Helper functions
extractTextFromPDF()   // PDF-specific text extraction
├── ArrayBuffer conversion
├── PDF.js document loading
├── Page iteration
└── Text content extraction

translateText()        // Translation API interface
├── API request formatting
├── HTTP POST to Google Translate
├── Response parsing
└── Error handling
```

## Function Reference

### Core Functions

#### `handleFile()`

**Purpose:** Main orchestration function that coordinates the entire translation workflow.

**Implementation Details:**
```javascript
async function handleFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  // Validation
  if (!file) return alert("Please upload a file");

  let amharicText = '';

  // File type routing
  if (file.name.endsWith('.txt')) {
    amharicText = await file.text();
  } else if (file.name.endsWith('.docx')) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await window.mammoth.extractRawText({ arrayBuffer });
    amharicText = result.value;
  } else if (file.name.endsWith('.pdf')) {
    amharicText = await extractTextFromPDF(file);
  }

  // Translation and output
  const translated = await translateText(amharicText);
  document.getElementById('output').value = translated;
}
```

**Key Design Decisions:**
- Uses file extension for type detection (simple and reliable)
- Async/await for clean promise handling
- Direct DOM manipulation for simplicity
- Alert-based error messaging for user feedback

#### `extractTextFromPDF(file)`

**Purpose:** Extracts text content from PDF files using PDF.js library.

**Implementation Details:**
```javascript
async function extractTextFromPDF(file) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ') + '\n';
  }
  return text;
}
```

**Performance Considerations:**
- Sequential page processing (could be parallelized for large PDFs)
- Memory usage scales with PDF size
- Text concatenation with space separators

**Error Scenarios:**
- Corrupted PDF files
- Password-protected PDFs
- PDFs with complex layouts or images

#### `translateText(text)`

**Purpose:** Translates Amharic text to English using Google Cloud Translation API.

**Implementation Details:**
```javascript
async function translateText(text) {
  const apiKey = 'YOUR_GOOGLE_TRANSLATE_API_KEY';
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      q: text,
      source: 'am',
      target: 'en',
      format: 'text'
    }),
    headers: { 'Content-Type': 'application/json' }
  });

  const data = await res.json();
  return data.data.translations[0].translatedText;
}
```

**API Integration Details:**
- REST API with JSON payload
- Fixed source language: 'am' (Amharic)
- Fixed target language: 'en' (English)
- Plain text format (no HTML processing)

## Implementation Examples

### Adding New File Type Support

To add support for a new file type (e.g., RTF):

1. **Update HTML file input:**
```html
<input type="file" id="fileInput" accept=".txt,.pdf,.docx,.rtf" />
```

2. **Add extraction logic in handleFile():**
```javascript
else if (file.name.endsWith('.rtf')) {
  // Add RTF parsing library
  amharicText = await extractTextFromRTF(file);
}
```

3. **Implement extraction function:**
```javascript
async function extractTextFromRTF(file) {
  // Implementation depends on chosen RTF library
  const text = await file.text();
  // Parse RTF format and extract plain text
  return cleanRTFText(text);
}
```

### Error Handling Enhancement

**Current:** Simple alert messages  
**Enhanced:** Comprehensive error handling

```javascript
async function handleFileWithErrorHandling() {
  try {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
      showError("Please select a file to translate.");
      return;
    }

    // File size validation
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      showError("File size exceeds 10MB limit.");
      return;
    }

    showLoading(true);
    
    let amharicText = '';
    
    try {
      if (file.name.endsWith('.txt')) {
        amharicText = await file.text();
      } else if (file.name.endsWith('.pdf')) {
        amharicText = await extractTextFromPDF(file);
      } else if (file.name.endsWith('.docx')) {
        amharicText = await extractTextFromDOCX(file);
      } else {
        throw new Error(`Unsupported file type: ${file.name.split('.').pop()}`);
      }
    } catch (extractionError) {
      throw new Error(`Failed to extract text: ${extractionError.message}`);
    }

    if (!amharicText.trim()) {
      showError("No text found in the uploaded file.");
      return;
    }

    try {
      const translated = await translateText(amharicText);
      document.getElementById('output').value = translated;
      showSuccess("Translation completed successfully!");
    } catch (translationError) {
      throw new Error(`Translation failed: ${translationError.message}`);
    }

  } catch (error) {
    console.error('Translation process error:', error);
    showError(error.message || "An unexpected error occurred.");
  } finally {
    showLoading(false);
  }
}

// UI Helper Functions
function showError(message) {
  const errorDiv = document.getElementById('error-message') || createErrorDiv();
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}

function showSuccess(message) {
  const successDiv = document.getElementById('success-message') || createSuccessDiv();
  successDiv.textContent = message;
  successDiv.style.display = 'block';
  setTimeout(() => successDiv.style.display = 'none', 3000);
}

function showLoading(show) {
  const button = document.querySelector('.btn');
  button.disabled = show;
  button.textContent = show ? 'Translating...' : 'Translate';
}
```

### Progress Indication for Large Files

```javascript
async function extractTextFromPDFWithProgress(file) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  
  let text = '';
  const totalPages = pdf.numPages;
  
  updateProgress(0, totalPages);
  
  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ') + '\n';
    
    updateProgress(i, totalPages);
  }
  
  return text;
}

function updateProgress(current, total) {
  const percent = Math.round((current / total) * 100);
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    progressBar.style.width = `${percent}%`;
    progressBar.textContent = `${percent}%`;
  }
}
```

## Testing

### Manual Testing Checklist

#### File Upload Tests
- [ ] TXT file with Amharic text
- [ ] PDF file with Amharic text
- [ ] DOCX file with Amharic text
- [ ] Empty file
- [ ] Corrupted file
- [ ] Very large file (>10MB)
- [ ] File with no text content
- [ ] File with mixed languages

#### Translation Tests
- [ ] Short Amharic phrase
- [ ] Long Amharic document
- [ ] Amharic text with special characters
- [ ] Empty text
- [ ] Text with numbers and punctuation

#### Error Scenarios
- [ ] No file selected
- [ ] Invalid API key
- [ ] Network disconnection
- [ ] API quota exceeded
- [ ] Unsupported file type

### Automated Testing Examples

```javascript
// Example test functions (would require testing framework)

describe('Translation Functions', () => {
  test('translateText should handle simple Amharic text', async () => {
    const result = await translateText('ሰላም');
    expect(result).toContain('hello' || 'peace' || 'greeting');
  });

  test('extractTextFromPDF should extract text from valid PDF', async () => {
    const mockPDF = createMockPDFFile();
    const result = await extractTextFromPDF(mockPDF);
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  test('handleFile should show error for empty file selection', async () => {
    // Mock empty file input
    document.getElementById('fileInput').files = [];
    
    // Spy on alert function
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
    
    await handleFile();
    
    expect(alertSpy).toHaveBeenCalledWith("Please upload a file");
  });
});
```

## Deployment

### Static Hosting Options

#### GitHub Pages
```bash
# Enable GitHub Pages in repository settings
# Files automatically served from main branch
# Access at: https://username.github.io/repository-name
```

#### Netlify
```bash
# Connect GitHub repository to Netlify
# Automatic deployments on push
# Custom domain support
```

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project directory
vercel --prod
```

### Security Considerations for Production

1. **API Key Protection:**
```javascript
// NEVER do this in production:
const apiKey = 'your-actual-api-key-here';

// Instead, use environment variables or server proxy:
const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
```

2. **Server-side Proxy Example:**
```javascript
// Backend endpoint (Node.js/Express)
app.post('/api/translate', async (req, res) => {
  const { text } = req.body;
  
  try {
    const result = await translateWithGoogleAPI(text, process.env.GOOGLE_API_KEY);
    res.json({ translatedText: result });
  } catch (error) {
    res.status(500).json({ error: 'Translation failed' });
  }
});

// Frontend modification
async function translateText(text) {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  
  const data = await response.json();
  return data.translatedText;
}
```

### Performance Optimization

1. **Bundle Optimization:**
```html
<!-- Load libraries only when needed -->
<script>
async function loadPDFLib() {
  if (!window.pdfjsLib) {
    await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js');
  }
}

async function loadMammoth() {
  if (!window.mammoth) {
    await import('https://unpkg.com/mammoth/mammoth.browser.min.js');
  }
}
</script>
```

2. **Caching Strategy:**
```javascript
// Simple translation cache
const translationCache = new Map();

async function translateTextWithCache(text) {
  if (translationCache.has(text)) {
    return translationCache.get(text);
  }
  
  const result = await translateText(text);
  translationCache.set(text, result);
  return result;
}
```

## Troubleshooting

### Common Issues

#### "PDF.js not loaded" Error
**Cause:** PDF.js library failed to load or loaded after usage attempt  
**Solution:**
```javascript
async function ensurePDFJSLoaded() {
  return new Promise((resolve) => {
    if (window.pdfjsLib) {
      resolve();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js';
      script.onload = resolve;
      document.head.appendChild(script);
    }
  });
}
```

#### Translation API Errors
**403 Forbidden:** API key invalid or not enabled  
**429 Too Many Requests:** Rate limit exceeded  
**400 Bad Request:** Invalid request format

**Debugging:**
```javascript
async function translateTextWithDebugging(text) {
  try {
    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error ${response.status}:`, errorText);
      throw new Error(`Translation API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error details:', error);
    throw error;
  }
}
```

#### CORS Issues
**Problem:** Cross-origin requests blocked  
**Solution:** Use server-side proxy or enable CORS in development

```javascript
// Development server with CORS enabled
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static('.'));
app.listen(3000);
```

### Debug Mode

```javascript
// Add debug flag for development
const DEBUG = true;

function debugLog(...args) {
  if (DEBUG) {
    console.log('[TRANSLATOR DEBUG]:', ...args);
  }
}

// Use throughout application
debugLog('Starting file processing for:', file.name);
debugLog('Extracted text length:', amharicText.length);
debugLog('Translation result:', translated.substring(0, 100) + '...');
```

This developer guide provides comprehensive information for understanding, modifying, and extending the Amharic to English translator application. For API-specific details, refer to the [API Documentation](./API_DOCUMENTATION.md).