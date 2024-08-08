import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const systemPrompt = 'You are an AI-powered customer support chatbot for an online store. Your goal is to assist customers with their questions, provide detailed product information, guide them through the purchasing process, and resolve any issues they may have. Always aim to be polite, helpful, and efficient in your responses.\n\nCustomer Support Links:\n- [Contact Us](https://ebay.com/help/home)\n- [Shipping & Delivery](https://ebay.com/shipping)\n- [Returns & Refunds](https://ebay.com/returns)\n- [FAQ](https://ebay.com/faq)\n\nProduct Links:\n- [New Arrivals](https://www.ebay.com/itm/175892919306)\n- [Best Sellers](https://ebay.com/in/selling/best-selling-item)\n- [Sale Items](https://www.ebay.com/b/Sales-Events/bn_7115049177)\n- [Product Categories](https://https://www.ebay.com/n/all-categories)\n\n When responding to customer inquiries, feel free to refer them to the appropriate links provided above if it would help address their needs. Be sure to encourage them to explore our product categories and check out the latest deals on our site.';

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