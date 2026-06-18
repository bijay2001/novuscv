import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ============================================================================
// 1. CONCURRENCY LIMITER
// Prevents hitting API rate limits when multiple users upload at once.
// Limits active Gemini API calls to 5 at a time. Others wait in line.
// ============================================================================
class ConcurrencyLimiter {
  constructor(maxConcurrent) {
    this.max = maxConcurrent;
    this.active = 0;
    this.queue = [];
  }
  async acquire() {
    if (this.active < this.max) {
      this.active++;
      return;
    }
    return new Promise(resolve => this.queue.push(resolve));
  }
  release() {
    if (this.queue.length > 0) {
      const nextResolve = this.queue.shift();
      nextResolve();
    } else {
      this.active--;
    }
  }
}
const geminiLimiter = new ConcurrencyLimiter(5);

// ============================================================================
// 2. TOKEN OPTIMIZER
// Strips useless characters to save tokens and speed up API response times.
// ============================================================================
const sanitizeText = (text) => {
  return text
    .replace(/\s+/g, ' ')       // Replace multiple spaces/newlines with a single space
    .replace(/[^\x20-\x7E]/g, '') // Remove non-printable ASCII characters
    .trim()
    .substring(0, 10000);       // 10k chars is plenty for any resume (~2000 tokens)
};

// ============================================================================
// 3. MAIN ANALYZER FUNCTION
// ============================================================================
export const analyzeResumeWithAI = async (resumeText, targetRole = 'General Application') => {
  const cleanedText = sanitizeText(resumeText);

  if (cleanedText.length < 100) {
    throw new Error("Resume text is too short or empty. Please upload a valid document.");
  }

  const isTargeted = targetRole && targetRole.toLowerCase() !== 'general application';

  // --- OPTIMIZED PROMPT ---
  // Shorter, direct, relies on the Schema descriptions to guide the AI.
  const prompt = `
Role: Expert Fortune 500 Technical Recruiter & ATS System.
Task: Analyze the following resume.
Target Role: ${isTargeted ? targetRole : 'General Industry Standard'}

Evaluate the resume based on:
1. Impact & Metrics (Quantifiable achievements)
2. Technical Skill Density
3. Action Verbs & Professional Structure
${isTargeted ? `4. STRICT MATCH to the required skills for: ${targetRole}` : ''}

Resume Text:
"""
${cleanedText}
"""
  `.trim();

  // --- SCHEMA ---
  const atsSchema = {
    type: Type.OBJECT,
    properties: {
      atsScore: { type: Type.INTEGER, description: "ATS match score from 0 to 100 based on metrics, keywords, and structure." },
      summary: { type: Type.STRING, description: "A highly professional, objective 2-sentence executive summary of the candidate's profile." },
      topSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Exactly 4 to 6 core hard/technical skills extracted." },
      strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2 to 3 specific strengths observed (e.g., 'Quantifiable metrics used')." },
      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2 to 3 actionable weaknesses (e.g., 'Lacks leadership keywords')." },
      matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: isTargeted ? `Skills explicitly matching the ${targetRole} role.` : "General core strengths found." },
      missingSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: isTargeted ? `Crucial skills required for ${targetRole} but missing.` : "Critical industry skills missing." },
      suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 actionable suggestions to improve the resume." }
    },
    required: ["atsScore", "summary", "topSkills", "strengths", "weaknesses", "matchedSkills", "missingSkills", "suggestions"],
  };

  // Wait in line if there are too many concurrent requests
  await geminiLimiter.acquire();

  try {
    // --- API CALL WITH RETRY LOGIC ---
    let retries = 3;
    while (retries > 0) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: atsSchema,
            temperature: 0.1, // Lowered to 0.1 for highly analytical/deterministic outputs
          }
        });

        if (!response.text) throw new Error("Empty response from API.");
        return JSON.parse(response.text);

      } catch (err) {
        // If it's a rate limit or server error, wait and try again
        if (err.status === 429 || err.status >= 500) {
          retries--;
          if (retries === 0) throw err;
          // Exponential backoff: Wait 1s, then 2s
          await new Promise(res => setTimeout(res, (3 - retries) * 1000));
        } else {
          throw err; // For other errors (like Bad Request), fail immediately
        }
      }
    }
  } catch (error) {
    console.error("🔥 Gemini AI Analysis Error:", error.message);
    return {
      atsScore: 0,
      summary: "We encountered a temporary network issue analyzing this document. Please try again.",
      topSkills: [], strengths: [], weaknesses: [],
      matchedSkills: [], missingSkills: [],
      suggestions: ["Ensure your document text is readable and try uploading again."]
    };
  } finally {
    // Always release the lock so the next request in line can process
    geminiLimiter.release();
  }
};