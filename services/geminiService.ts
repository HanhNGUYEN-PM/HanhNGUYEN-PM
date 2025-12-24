
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDiagramCode = async (prompt: string, currentCode: string = ""): Promise<string> => {
  const systemInstruction = `You are a world-class system architect specializing in PlantUML.
Your task is to generate or modify PlantUML code.

STRICT SYNTAX RULES:
1. START with @startuml and END with @enduml.
2. NEVER include markdown code blocks like \`\`\`plantuml or \`\`\`.
3. ALWAYS use a single backslash for new lines in labels: \\n (e.g., "Line 1\\nLine 2").
4. Ensure spaces after keywords: actor "Name", participant "Name".
5. For long diagrams, ensure the logic is valid and markers (if/endif, loop/end) are balanced.

STYLING GUIDELINES:
- If the user asks for a colorful or vibrant diagram, use 'skinparam' settings.
- Avoid 'skinparam monochrome true' unless specifically requested.
- Use HEX colors for specific elements if requested (e.g., #FF5722).

Respond ONLY with the raw PlantUML code.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Current code:\n${currentCode}\n\nUser request: ${prompt}`,
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
  const systemInstruction = `You are a world-class system architect. Your specialty is converting system logic from one diagram paradigm to another using PlantUML.

TASK:
Convert the provided PlantUML code into a ${targetType.toUpperCase()} diagram.

RULES:
1. Preserve all logic, actors, steps, and descriptions.
2. If converting to BPMN/Flow, map actors to 'partitions' or 'lanes'.
3. If converting to Sequence, map process steps to messages between participants.
4. Maintain a clean, professional aesthetic using modern skinparams.
5. Output ONLY the raw PlantUML code starting with @startuml and ending with @enduml.
6. NO markdown backticks.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Convert this code to a ${targetType} diagram:\n\n${currentCode}`,
    config: {
      systemInstruction,
      temperature: 0.2,
    },
  });

  const text = response.text || "";
  const match = text.match(/@startuml[\s\S]*?@enduml/);
  return match ? match[0] : text.trim();
};

export const explainDiagram = async (code: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Explique ce diagramme PlantUML de manière concise en français :\n\n${code}`,
  });
  return response.text || "Aucune explication disponible.";
};
