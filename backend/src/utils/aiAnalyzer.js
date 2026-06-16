// import { GoogleGenAI } from '@google/genai';
// import dotenv from 'dotenv';

// dotenv.config();

// // Initialize the new Gemini SDK
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// export const analyzeResumeWithAI = async (resumeText) => {
//   try {
//     // We use gemini-2.5-flash because it is incredibly fast and perfect for text processing
//     const prompt = `
//       You are an expert Technical Recruiter and ATS (Applicant Tracking System) software.
//       Please analyze the following resume text.
      
//       Resume Text:
//       """
//       ${resumeText}
//       """

//       You must respond ONLY with a valid JSON object. Do not include markdown formatting like \`\`\`json.
//       The JSON must perfectly match this structure:
//       {
//         "atsScore": 85, // A number between 0 and 100
//         "summary": "A 2-sentence summary of the candidate's profile.",
//         "topSkills": ["React", "Node.js", "MongoDB", "MySQL"], // Array of up to 6 key skills found
//         "strengths": ["Strong backend experience", "Good formatting"], // Array of 2-3 points
//         "weaknesses": ["Missing measurable achievements", "No mention of cloud deployment"] // Array of 2-3 points
//       }
//     `;

//     // Send the prompt to Gemini and force the output to be JSON
//     const response = await ai.models.generateContent({
//       model: 'gemini-2.5-flash',
//       contents: prompt,
//       config: {
//         responseMimeType: "application/json",
//       }
//     });

//     // The SDK returns the text, which we parse into a usable JavaScript Object
//     return JSON.parse(response.text);

//   } catch (error) {
//     console.error("Gemini AI Error:", error);
//     throw new Error("Failed to analyze resume with AI.");
//   }
// };

import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const analyzeResumeWithAI = async (resumeText) => {
  // --- 1. Pre-Flight Safety Check ---
  if (!resumeText || resumeText.trim().length < 100) {
    throw new Error("Resume text is too short or empty. Please upload a valid document.");
  }

  try {
    // --- 2. Advanced ATS Recruiter Prompt ---
    const prompt = `
      You are an elite Fortune 500 Technical Recruiter and an advanced ATS (Applicant Tracking System) parser.
      Perform a deep-dive analysis on the provided resume text.

      CALCULATE THE ATS SCORE (0-100) based strictly on this rubric:
      - Impact & Metrics (30%): Does the candidate use numbers, percentages, and data to quantify their achievements?
      - Action Verbs (20%): Do bullet points start with strong action verbs (e.g., "Architected", "Spearheaded") rather than passive phrases (e.g., "Responsible for")?
      - Skill Density (30%): Is there a high density of clear, recognizable hard skills and modern tools?
      - Parseability & Structure (20%): Is the text cleanly organized with standard logical flow (Experience, Education, Skills)? Deduct points for gibberish or poor parsing.

      Resume Text:
      """
      ${resumeText}
      """
    `;

    // --- 3. Strict Schema Definition ---
    // This guarantees Gemini returns exactly this structure, with these data types.
    const atsSchema = {
      type: Type.OBJECT,
      properties: {
        atsScore: { 
          type: Type.INTEGER, 
          description: "The calculated ATS score between 0 and 100 based on the rubric." 
        },
        summary: { 
          type: Type.STRING, 
          description: "A professional, objective 2-sentence executive summary of the candidate's profile." 
        },
        topSkills: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "Exactly 4 to 6 of the most prominent hard technical skills found in the text."
        },
        strengths: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "2 to 3 specific strengths found in the resume (e.g., 'Strong use of quantitative metrics')."
        },
        weaknesses: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "2 to 3 actionable areas for improvement (e.g., 'Missing measurable achievements in recent roles')."
        }
      },
      required: ["atsScore", "summary", "topSkills", "strengths", "weaknesses"],
    };

    // --- 4. The API Call ---
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        // Enforce JSON and pass the exact schema
        responseMimeType: "application/json",
        responseSchema: atsSchema,
        // Lower temperature makes the AI more analytical and less "creative/random"
        temperature: 0.2, 
      }
    });

    // --- 5. Safe Parsing ---
    if (!response.text) {
      throw new Error("AI returned an empty response.");
    }

    const report = JSON.parse(response.text);
    return report;

  } catch (error) {
    console.error("🔥 Gemini AI Analysis Error:", error.message);
    
    // Fallback object so your frontend doesn't crash entirely if the AI fails
    return {
      atsScore: 0,
      summary: "We encountered an issue analyzing this resume. Please try again.",
      topSkills: ["Error parsing skills"],
      strengths: ["N/A"],
      weaknesses: ["Document could not be processed completely."]
    };
  }
};