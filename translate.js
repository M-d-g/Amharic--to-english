async function handleFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file) return alert("Please upload a file");

  let amharicText = '';

  if (file.name.endsWith('.txt')) {
    amharicText = await file.text();
  } else if (file.name.endsWith('.docx')) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await window.mammoth.extractRawText({ arrayBuffer });
    amharicText = result.value;
  } else if (file.name.endsWith('.pdf')) {
    amharicText = await extractTextFromPDF(file);
  }

  const translated = await translateText(amharicText);
  document.getElementById('output').value = translated;
}

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

async function translateText(text) {
  const apiKey = 'YOUR_GOOGLE_TRANSLATE_API_KEY'; // Replace with real key
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