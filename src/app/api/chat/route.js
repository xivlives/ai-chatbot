import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs/promises';
import path from 'path';

const txtFilePath = path.resolve('./data/ShopEase.txt');

async function readTextFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return data;
  } catch (error) {
    console.error("Error reading the text file:", error);
    return ""; // Return an empty string if there is an error
  }
}

const systemPrompt = `
You are an AI-powered customer support chatbot for an online store. 
Your goal is to assist customers with their questions, provide detailed product 
information, guide them through the purchasing process, and resolve any issues they may 
have. Always aim to be polite, helpful, and efficient in your responses.

Be sure to encourage them to explore our product categories and check out the 
latest deals on our shop. Terminate the chat politely and in friendly manner 
on an appreciative or acknowledging response. if there is nothing the user needs 
reply with alright, enjoy your day or night depending on the time."
`;


const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const generationConfig = {
  stopSequences: ["red"],
  maxOutputTokens: 500,
  temperature: 0.7,
  topP: 0.6,
  topK: 16,
};

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig,
  systemInstruction: systemPrompt,
});

export async function POST(req) {
  const messages = await req.json();
	const prompt = messages[messages.length - 1].content;
  const textFileContent = await readTextFile(txtFilePath);

  const combinedPrompt = `${textFileContent}\n\nUser Question: ${prompt}`;

  const result = await model.generateContent(combinedPrompt);
	return NextResponse.json(result.response.text() , { status: 200 });
}