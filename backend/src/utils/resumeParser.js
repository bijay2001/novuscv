import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import path from 'path';

export const extractTextFromFile = async (filePath) => {
  try {
    const ext = path.extname(filePath).toLowerCase();
    let extractedText = '';

    if (ext === '.pdf') {
      // Handle PDF
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
      
    } else if (ext === '.docx') {
      // Handle DOCX
      const result = await mammoth.extractRawText({ path: filePath });
      extractedText = result.value;
      
    } else {
      throw new Error("Unsupported file format");
    }

    // Clean up the text (remove excessive newlines and spaces)
    return extractedText.replace(/\n\s*\n/g, '\n').trim();

  } catch (error) {
    console.error("Text Extraction Error:", error);
    throw new Error("Failed to parse document text");
  }
};