# Amharic to English Translator - API Documentation

## Overview

The Amharic to English Translator is a web-based application that allows users to upload documents in various formats (TXT, PDF, DOCX) containing Amharic text and translate them to English using Google Translate API.

## Table of Contents

1. [Public APIs](#public-apis)
2. [Functions](#functions)
3. [Components](#components)
4. [Configuration](#configuration)
5. [Usage Examples](#usage-examples)
6. [Error Handling](#error-handling)

## Public APIs

### Google Translate API Integration

The application integrates with Google Cloud Translation API v2 for text translation services.

**Base URL:** `https://translation.googleapis.com/language/translate/v2`

**Authentication:** API Key required

## Functions

### `handleFile()`

**Description:** Main handler function for file upload and translation process. Processes different file types and orchestrates the translation workflow.

**Signature:** 
```javascript
async function handleFile()
```

**Parameters:** None (reads from DOM elements)

**Returns:** `Promise<void>`

**Usage:**
```javascript
// Called when user clicks the translate button
<button class="btn" onclick="handleFile()">Translate</button>
```

**Behavior:**
1. Retrieves the selected file from the file input element
2. Validates file selection
3. Extracts text based on file type (.txt, .docx, .pdf)
4. Calls translation function
5. Updates the output textarea with translated text

**Error Cases:**
- Shows alert if no file is selected
- Handles file reading errors for different formats

---

### `extractTextFromPDF(file)`

**Description:** Extracts text content from PDF files using PDF.js library.

**Signature:**
```javascript
async function extractTextFromPDF(file)
```

**Parameters:**
- `file` (File): PDF file object from file input

**Returns:** `Promise<string>` - Extracted text content from all pages

**Usage:**
```javascript
const pdfFile = document.getElementById('fileInput').files[0];
const extractedText = await extractTextFromPDF(pdfFile);
console.log(extractedText);
```

**Implementation Details:**
1. Converts file to ArrayBuffer
2. Loads PDF document using pdfjsLib
3. Iterates through all pages
4. Extracts text content from each page
5. Concatenates all text with newlines

**Dependencies:** 
- PDF.js library (cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js)

**Error Cases:**
- Invalid PDF format
- Corrupted PDF files
- Memory issues with large PDFs

---

### `translateText(text)`

**Description:** Translates Amharic text to English using Google Translate API.

**Signature:**
```javascript
async function translateText(text)
```

**Parameters:**
- `text` (string): Amharic text to be translated

**Returns:** `Promise<string>` - Translated English text

**Usage:**
```javascript
const amharicText = "ሰላም ዓለም";
const englishText = await translateText(amharicText);
console.log(englishText); // Output: "Hello World"
```

**API Request Format:**
```json
{
  "q": "text_to_translate",
  "source": "am",
  "target": "en", 
  "format": "text"
}
```

**API Response Format:**
```json
{
  "data": {
    "translations": [
      {
        "translatedText": "Hello World"
      }
    ]
  }
}
```

**Configuration Required:**
- Replace `YOUR_GOOGLE_TRANSLATE_API_KEY` with actual Google Cloud API key
- Enable Google Cloud Translation API in your Google Cloud Console

**Error Cases:**
- Invalid API key
- API quota exceeded
- Network connectivity issues
- Unsupported source language

## Components

### File Input Component

**HTML Element:**
```html
<input type="file" id="fileInput" accept=".txt,.pdf,.docx" />
```

**Description:** File selection input that accepts TXT, PDF, and DOCX files.

**Supported File Types:**
- `.txt` - Plain text files
- `.pdf` - PDF documents  
- `.docx` - Microsoft Word documents

**Access Method:**
```javascript
const fileInput = document.getElementById('fileInput');
const selectedFile = fileInput.files[0];
```

---

### Translate Button

**HTML Element:**
```html
<button class="btn" onclick="handleFile()">Translate</button>
```

**Description:** Trigger button that starts the translation process.

**Event Handler:** `handleFile()`

---

### Output Textarea

**HTML Element:**
```html
<textarea id="output" readonly></textarea>
```

**Description:** Read-only textarea that displays the translated English text.

**Access Method:**
```javascript
const output = document.getElementById('output');
output.value = translatedText;
```

## Configuration

### Environment Setup

1. **Google Cloud API Key:**
   ```javascript
   const apiKey = 'YOUR_ACTUAL_API_KEY_HERE';
   ```

2. **Required External Libraries:**
   ```html
   <!-- PDF.js for PDF processing -->
   <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js"></script>
   
   <!-- Mammoth.js for DOCX processing -->
   <script src="https://unpkg.com/mammoth/mammoth.browser.min.js"></script>
   ```

3. **File Permissions:**
   - Application requires file read permissions
   - No server-side storage needed

## Usage Examples

### Basic Text File Translation

```javascript
// 1. User selects a .txt file containing Amharic text
// 2. User clicks translate button
// 3. System processes the file

// Example workflow:
const fileInput = document.getElementById('fileInput');
// User selects file: "sample.txt" containing "ሰላም ዓለም"

// When handleFile() is called:
// 1. File is read as text
// 2. translateText("ሰላም ዓለም") is called
// 3. Result "Hello World" appears in output textarea
```

### PDF Document Translation

```javascript
// Example: Translating a PDF document
const pdfFile = new File([pdfBlob], "document.pdf", { type: "application/pdf" });

// Internal process:
// 1. extractTextFromPDF(pdfFile) extracts all text
// 2. translateText(extractedText) translates the content
// 3. Translated text is displayed in output
```

### DOCX Document Translation

```javascript
// Example: Translating a Word document
const docxFile = new File([docxBlob], "document.docx", { 
  type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
});

// Internal process:
// 1. File is converted to ArrayBuffer
// 2. Mammoth.js extracts raw text
// 3. Text is translated via Google Translate API
// 4. Result is displayed
```

### Error Handling Examples

```javascript
// No file selected
handleFile(); // Shows: "Please upload a file"

// API key not configured
await translateText("ሰላም"); // May throw network error

// Unsupported file type
// File input accepts attribute prevents unsupported files
```

## Error Handling

### Client-Side Errors

1. **No File Selected:**
   ```javascript
   if (!file) return alert("Please upload a file");
   ```

2. **File Reading Errors:**
   - PDF parsing errors
   - DOCX extraction failures
   - Large file memory issues

### API Errors

1. **Authentication Errors:**
   - Invalid API key
   - API key not enabled for Translation API

2. **Quota Errors:**
   - Daily/monthly API limits exceeded
   - Rate limiting

3. **Network Errors:**
   - Connection timeouts
   - Service unavailability

### Best Practices

1. **API Key Security:**
   - Store API keys securely (environment variables)
   - Implement server-side proxy for production
   - Never expose keys in client-side code

2. **File Size Limits:**
   - Implement file size validation
   - Consider chunking for large documents
   - Add progress indicators for long operations

3. **User Experience:**
   - Add loading indicators during translation
   - Provide clear error messages
   - Support drag-and-drop file upload

## Browser Compatibility

**Supported Browsers:**
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

**Required Features:**
- File API
- Fetch API
- Async/Await
- ArrayBuffer support

## Security Considerations

1. **API Key Protection:** Never expose API keys in client-side code
2. **File Validation:** Validate file types and sizes before processing
3. **Content Sanitization:** Sanitize translated text before display
4. **CORS Policy:** Ensure proper CORS configuration for API calls

## Performance Optimization

1. **File Size Limits:** Implement reasonable file size restrictions
2. **Caching:** Consider caching translations for repeated content
3. **Compression:** Use text compression for large documents
4. **Lazy Loading:** Load external libraries only when needed