import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import path from 'path';

export const extractTextFromFile = async (filePath) => {
  try {
    const ext = path.extname(filePath).toLowerCase();
    let extractedText = '';

    if (ext === '.pdf') {
      const dataBuffer = await fs.promises.readFile(filePath);
      
      try {
        // This prevents Memory/RAM exhaustion from massive PDF files.
        const pdfData = await pdfParse(dataBuffer, { max: 3 });
        extractedText = pdfData.text;
      } catch (pdfError) {
        console.error("PDF Parsing Core Error:", pdfError);
        throw new Error("Could not extract text from this PDF. It may be encrypted or corrupted.");
      }
      
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      extractedText = result.value;
      
    } else {
      throw new Error("Unsupported file format");
    }

    return extractedText
      .replace(/\r\n/g, '\n')     
      .replace(/\n\s*\n/g, '\n')  
      .replace(/\t/g, ' ')        
      .trim();

  } catch (error) {
    console.error("Text Extraction Error:", error);
    throw new Error(error.message || "Failed to parse document text");
  }
};