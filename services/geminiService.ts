
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDiagramCode = async (prompt: string, currentCode: string = ""): Promise<string> => {
  const systemInstruction = `You are an expert PlantUML architect. Your goal is to generate perfectly valid, modern, and visually clean PlantUML code for Sequence and Activity (Flow) diagrams.

CORE RULES:
1. START/STOP: Every flow diagram MUST start with 'start' and end with 'stop'.
2. ACTIVITY SYNTAX: Use ':Task description;' (colon at start, semicolon at end).
3. STYLING: Include 'skinparam shadowed false' and use clean titles.
4. NO MARKDOWN: Output only raw PlantUML code between @startuml and @enduml.
5. CLARITY: Ensure logic is easy to follow and uses standard UML conventions.

EXAMPLE:
@startuml
skinparam shadowed false
start
:Action;
stop
@enduml`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Current code context:\n${currentCode}\n\nTask: ${prompt}`,
    config: {
      systemInstruction,
      temperature: 0.1,
    },
  });

  const text = response.text || "";
  const match = text.match(/@startuml[\s\S]*?@enduml/);
  return match ? match[0] : text.trim();
};

export const convertDiagramCode = async (currentCode: string, targetType: string): Promise<string> => {
  const systemInstruction = `You are a specialized tool for converting PlantUML diagrams.
Your goal: Transform the LOGIC of the source diagram into a high-quality ${targetType.toUpperCase()} diagram.

CONVERSION STRATEGY:
- If converting FROM Sequence TO Flow/Activity:
  - Map each 'A -> B : message' to an activity ':message;'.
  - Preserve the vertical order of steps.
- If converting FROM Flow/Activity TO Sequence:
  - Identify actors or systems from the text and create participants.
  - Convert steps into messages between participants.

STRICT SYNTAX:
- Always use 'start' and 'stop' for flow diagrams.
- Always wrap in @startuml and @enduml.
- Output ONLY the raw code. NO markdown blocks.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Translate this diagram logic into a clean ${targetType.toUpperCase()} diagram:\n\n${currentCode}`,
    config: {
      systemInstruction,
      temperature: 0.1,
    },
  });

  const text = response.text || "";
  const match = text.match(/@startuml[\s\S]*?@enduml/);
  return match ? match[0] : text.trim();
};

export const explainDiagram = async (code: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Explique ce diagramme PlantUML de manière concise en français. Détaille les étapes logiques et les interactions :\n\n${code}`,
  });
  return response.text || "Aucune explication disponible.";
};