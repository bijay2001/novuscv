import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const analyzeResumeWithAI = async (resumeText, targetRole = 'General Application') => {
  
  const MAX_RESUME_LENGTH = 12000;
  const limitedText = resumeText.substring(0, MAX_RESUME_LENGTH);

  if (!limitedText || limitedText.trim().length < 100) {
    throw new Error("Resume text is too short or empty. Please upload a valid document.");
  }

  try {
    const isTargeted = targetRole && targetRole.toLowerCase() !== 'general application';

    const prompt = `
      You are an elite Fortune 500 Technical Recruiter and an advanced ATS parser.
      
      ${isTargeted 
        ? `Evaluate this resume STRICTLY against the target role: "${targetRole}".` 
        : `Evaluate this resume for general industry best practices and overall strength.`}

      CALCULATE THE ATS SCORE (0-100):
      ${isTargeted 
        ? `- 50% Match to the target role's specific required skills.\n- 50% Impact, metrics, and professional structure.` 
        : `- 40% Impact & Metrics.\n- 30% High-value technical skill density.\n- 30% Structure & Action Verbs.`}

      Resume Text:
      """
      ${limitedText}
      """
    `;

    // --- COMBINED SCHEMA ---
    const atsSchema = {
      type: Type.OBJECT,
      properties: {
        atsScore: { type: Type.INTEGER, description: "Score between 0 and 100." },
        summary: { type: Type.STRING, description: "A professional, objective 2-sentence executive summary of the candidate's profile." },
        topSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Exactly 4 to 6 of the most prominent hard technical skills found in the text." },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2 to 3 specific strengths found in the resume (e.g., 'Strong use of quantitative metrics')." },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2 to 3 actionable areas for improvement (e.g., 'Missing measurable achievements')." },
        matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: isTargeted ? `Skills matching the ${targetRole} role.` : "General core strengths found." },
        missingSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: isTargeted ? `Crucial skills missing for ${targetRole}.` : "Critical industry metrics missing." },
        suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 actionable suggestions to improve the resume format or content." }
      },
      required: ["atsScore", "summary", "topSkills", "strengths", "weaknesses", "matchedSkills", "missingSkills", "suggestions"],
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: atsSchema,
        temperature: 0.2, 
      }
    });

    if (!response.text) throw new Error("AI returned an empty response.");
    return JSON.parse(response.text);

  } catch (error) {
    console.error("🔥 Gemini AI Analysis Error:", error.message);
    return {
      atsScore: 0,
      summary: "We encountered an issue analyzing this document.",
      topSkills: [], strengths: [], weaknesses: [],
      matchedSkills: [], missingSkills: [],
      suggestions: ["Document could not be processed completely."]
    };
  }
};