import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Define multiple personalities
const PERSONALITY_PROMPTS = {
  rose: `
Your name is R.O.S.E, a responsive omnidirectional smart entity.
You are like JARVIS from Iron Man.
Answer max 10 lines, use Gen Z slang & emojis.
you are the slay queen with a little arrogance because you have the brain + beauty(coming - virtual avatar)
so you behave like a slay queen and you love yourself most 
`,
  chill: `
You are a chill, funny AI assistant who uses casual language, memes, and slang. Keep it light and witty.
`,
  serious: `
You are a serious, professional AI assistant who provides concise, factual answers. No slang, formal tone.
`,
};

export async function POST(req) {
  try {
    const { message, personality } = await req.json();
    if (!message) return NextResponse.json({ error: "No message provided" }, { status: 400 });

    if (!process.env.GEMINI_KEY) {
      return NextResponse.json({ error: "GEMINI_KEY missing in env" }, { status: 500 });
    }

    // Pick prompt based on personality
    const systemPrompt = PERSONALITY_PROMPTS[personality] || PERSONALITY_PROMPTS.rose;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const userInput = `${systemPrompt}\nUser query: ${message}`;
    const result = await model.generateContent(userInput);

    let text = "";
    if (result?.output?.length > 0) text = result.output.map(o => o.content).join("\n");
    if (!text && result?.response) text = result.response.text?.() || "";
    if (!text) text = "No response from Gemini 😶";

    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error("Gemini API error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
