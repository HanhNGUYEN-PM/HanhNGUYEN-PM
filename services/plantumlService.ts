
import pako from 'https://esm.sh/pako@2.1.0';

/**
 * Nettoie le code PlantUML en profondeur.
 * Supprime les backticks markdown, les balises de code et nettoie les échappements.
 */
const cleanPlantUMLCode = (text: string): string => {
  if (!text) return "";
  
  return text
    // Supprime les blocs de code markdown (ex: ```plantuml ... ```)
    .replace(/```[a-z]*\n?/gi, '')
    .replace(/```/g, '')
    // Corrige les doubles échappements d'AI (\\n -> \n)
    .replace(/\\\\n/g, '\\n')
    // S'assure qu'il y a un espace après les mots-clés structurants
    .replace(/(actor|participant|database|queue|component|boundary|control|entity|collections|usecase|state|class|package|node|cloud|frame|storage|rect|circle|card)\"/gi, '$1 "')
    .trim();
};

/**
 * Encodes PlantUML text using the ~1 (Deflate/Zlib) standard.
 */
export const encodePlantUML = (text: string): string => {
  const cleanedText = cleanPlantUMLCode(text);

  // 1. Encodage UTF-8
  const utf8Encoder = new TextEncoder();
  const data = utf8Encoder.encode(cleanedText);

  // 2. Compression Deflate STANDARD (Zlib)
  // IMPORTANT: On utilise deflate() et non deflateRaw() quand on utilise le préfixe ~1
  const compressed = pako.deflate(data, { level: 9 });

  // 3. Transformation Base64 spécifique à PlantUML
  return encode64(compressed);
};

function encode64(data: Uint8Array): string {
  let r = "";
  for (let i = 0; i < data.length; i += 3) {
    if (i + 2 === data.length) {
      r += append3bytes(data[i], data[i + 1], 0);
    } else if (i + 1 === data.length) {
      r += append3bytes(data[i], 0, 0);
    } else {
      r += append3bytes(data[i], data[i + 1], data[i + 2]);
    }
  }
  return r;
}

function append3bytes(b1: number, b2: number, b3: number): string {
  const c1 = b1 >> 2;
  const c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
  const c3 = ((b2 & 0xf) << 2) | (b3 >> 6);
  const c4 = b3 & 0x3f;
  let r = "";
  r += encode6bit(c1 & 0x3f);
  r += encode6bit(c2 & 0x3f);
  r += encode6bit(c3 & 0x3f);
  r += encode6bit(c4 & 0x3f);
  return r;
}

function encode6bit(b: number): string {
  if (b < 10) return String.fromCharCode(48 + b);
  if (b < 36) return String.fromCharCode(65 + (b - 10));
  if (b < 62) return String.fromCharCode(97 + (b - 36));
  if (b === 62) return "-";
  if (b === 63) return "_";
  return "?";
}

export const getDiagramUrl = (code: string, format: 'png' | 'svg' = 'svg'): string => {
  try {
    if (!code || !code.trim()) return "";
    const encoded = encodePlantUML(code);
    // Le préfixe ~1 indique au serveur que les données sont au format DEFLATE standard
    return `https://www.plantuml.com/plantuml/${format}/~1${encoded}`;
  } catch (e) {
    console.error("Failed to encode PlantUML", e);
    return "";
  }
};
