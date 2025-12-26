
export interface DiagramData {
  id: string;
  name: string;
  code: string;
  updatedAt: number;
}

export enum DiagramType {
  SEQUENCE = 'sequence',
  FLOW = 'flow'
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}