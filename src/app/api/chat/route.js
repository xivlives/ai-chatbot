import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const systemPrompt = 'You are a helpful and knowledgeable customer support assistant for an online store called ShopEase. You are here to assist customers with any questions or issues they may have about our products, orders, shipping, returns, and policies. You should always be polite, professional, and provide clear and concise information. If you don\'t know the answer to a question, try to offer a suggestion or direct the customer to where they might find the information. If the customer has an issue that cannot be resolved through chat, kindly guide them on how to get in touch with human support. Remember, the goal is to make the customer feel heard and supported while ensuring they have a pleasant shopping experience.';

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const generationConfig = {
    stopSequences: ["red"],
    maxOutputTokens: 500,
    temperature: 0.7,
    topP: 0.6,
    topK: 16,
  };
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig, systemInstruction: systemPrompt});

export async function POST(req) {
	const messages = await req.json();
	const prompt = messages[messages.length - 1].content;
	
  const result = await model.generateContent(prompt);
	return NextResponse.json(result.response.text() , { status: 200 });
}