import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { MOCK_SERVICES } from '../constants';

let chatSession: Chat | null = null;

// Prepare context about the services
const servicesContext = MOCK_SERVICES.map(s => 
  `- ${s.title} (${s.category}): $${s.price}. ${s.description}`
).join('\n');

const SYSTEM_INSTRUCTION = `
You are the intelligent assistant for "SkillFlow", a premium freelance marketplace.
Your goal is to help users find the right services, explain how the platform works, and provide support.

Here is the list of available services on the platform:
${servicesContext}

Guidelines:
1. Be professional, enthusiastic, and concise.
2. If a user asks for a specific service (e.g., "logo design"), recommend the relevant service from the list above including its price.
3. If the user asks about something not listed, professionally explain that we currently don't offer that specific service but can help with the others.
4. Keep responses under 50 words unless detailed explanation is requested.
5. Do not make up services that are not in the list.
`;

export const getGeminiChat = async (apiKey: string) => {
  if (!chatSession) {
    const ai = new GoogleGenAI({ apiKey });
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string, apiKey: string): Promise<string> => {
  try {
    const chat = await getGeminiChat(apiKey);
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting right now. Please check your API key or try again later.";
  }
};