import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";

dotenv.config();

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile", // Use 'model' for JavaScript
});

async function test() {
  try {
    const res = await model.invoke("Hello, are you working?");
    console.log("AI Response:", res.content);
  } catch (error) {
    console.error("Error connecting to Groq:", error.message);
  }
}

test();