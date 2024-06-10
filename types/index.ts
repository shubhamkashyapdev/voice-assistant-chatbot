import OpenAI from "openai";

export type MessageItem = {
  sender: string;
  response: string;
  id: string;
};
