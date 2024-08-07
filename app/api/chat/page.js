// pages/api/chat.js

import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  const systemPrompt = {
    role: 'system',
    content: 'You are a helpful and knowledgeable customer support assistant for an online store called ShopEase. You are here to assist customers with any questions or issues they may have about our products, orders, shipping, returns, and policies. You should always be polite, professional, and provide clear and concise information. If you don\'t know the answer to a question, try to offer a suggestion or direct the customer to where they might find the information. If the customer has an issue that cannot be resolved through chat, kindly guide them on how to get in touch with human support. Remember, the goal is to make the customer feel heard and supported while ensuring they have a pleasant shopping experience.'
  };

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci-codex/completions',
      {
        prompt: `${systemPrompt.content}\nCustomer: ${message}\nSupport:`,
        max_tokens: 150,
        temperature: 0.7,
        stop: ['\n', ' Customer:', ' Support:']
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    const botMessage = response.data.choices[0].text.trim();
    res.status(200).json({ message: botMessage });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
}
