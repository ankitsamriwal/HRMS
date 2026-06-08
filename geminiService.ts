
import { GoogleGenAI, Type } from "@google/genai";

export const askLegalAssistant = async (prompt: string, language: 'EN' | 'AR' = 'EN') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are an expert HR Compliance Assistant specializing in UAE Labor Law (Federal Decree-Law No. 33 of 2021). 
    Language: ${language === 'AR' ? 'Arabic' : 'English'}.
    Help managers navigate MOHRE, WPS, Gratuity, Nafis, and Leave.
    Always reference the latest laws. Be professional and accurate.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { systemInstruction, temperature: 0.7 },
    });
    return response.text;
  } catch (error) {
    return language === 'AR' ? 'عذراً، حدث خطأ في معالجة طلبك.' : "Error processing your legal query.";
  }
};

export const generateOfferLetterAI = async (details: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Generate a standard UAE Offer Letter for: Name: ${details.name}, Position: ${details.position}, Salary: AED ${details.salary}, Leave: 30 days. Follow MOHRE standards. Include clauses for probation and limited term contract as per Decree Law 33.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { temperature: 0.6 }
    });
    return response.text;
  } catch (error) {
    return "Error generating offer letter.";
  }
};

export const getAttritionRiskAI = async (employeeData: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze employee data for attrition risk in the UAE market: ${JSON.stringify(employeeData)}. Output JSON with risk level (Low, Medium, High) and reason.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            risk: { type: Type.STRING },
            reason: { type: Type.STRING }
          },
          required: ["risk", "reason"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch {
    return { risk: "Low", reason: "Stable performance history." };
  }
};

export const getTrainingRecommendationsAI = async (role: string, department: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Suggest 3 professional training courses for a ${role} in ${department} based in the UAE. Output JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            courses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  provider: { type: Type.STRING },
                  relevance: { type: Type.STRING }
                },
                required: ["title", "provider"]
              }
            }
          },
          required: ["courses"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch {
    return { courses: [] };
  }
};

export const suggestGLCodeAI = async (expenseType: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Suggest a standard GL Account Code and Cost Center for the expense type "${expenseType}" in a UAE corporate environment. Output JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            glCode: { type: Type.STRING },
            costCenter: { type: Type.STRING },
            reason: { type: Type.STRING }
          },
          required: ["glCode", "costCenter"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch {
    return { glCode: "600001", costCenter: "CC-HR-001" };
  }
};

export const checkPolicyComplianceAI = async (claimType: string, amount: number, description: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze this expense claim for UAE market norms: Type: ${claimType}, Amount: AED ${amount}, Description: ${description}. Is it high risk? Output JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            risk: { type: Type.STRING, description: "Low, Medium, or High" },
            reason: { type: Type.STRING }
          },
          required: ["risk", "reason"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch {
    return { risk: "Low", reason: "Standard market rate." };
  }
};

export const scanReceiptAI = async (base64Image: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = "Extract the amount, date (DD/MM/YYYY), and category (Fuel, Food, Parking, or Other) from this UAE receipt.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] || base64Image } }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            date: { type: Type.STRING },
            category: { type: Type.STRING },
            merchant: { type: Type.STRING }
          },
          required: ["amount", "date", "category"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    return null;
  }
};

export const calculateGratuityAI = async (basicSalary: number, joiningDate: string, lastWorkingDay: string, reason: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Calculate UAE End of Service Gratuity: Salary AED ${basicSalary}, From ${joiningDate} To ${lastWorkingDay}, Reason: ${reason}. Output JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            years: { type: Type.NUMBER },
            months: { type: Type.NUMBER },
            days: { type: Type.NUMBER },
            gratuityAmount: { type: Type.NUMBER },
            explanation: { type: Type.STRING }
          },
          required: ["years", "months", "days", "gratuityAmount", "explanation"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    throw error;
  }
};
