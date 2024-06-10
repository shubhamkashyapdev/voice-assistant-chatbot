"use server";
import OpenAI from "openai";

async function transcript(prevState: any, formData: FormData) {
  "use server";

  const id = Math.random().toString(36);

  console.log("PREVIOUS STATE:", prevState);
  if (process.env.OPENAI_API_KEY === undefined) {
    console.error("Openai API Key credentials not set");
    return {
      sender: "",
      response: "Openai API Key credentials not set",
    };
  }

  const file = formData.get("audio") as File;
  if (file.size === 0) {
    return {
      sender: "",
      response: "No audio file provided",
    };
  }

  console.log(">>", file);

  // ---   get audio transcription from OpenAI Whisper ----

  console.log("== Transcribe Audio Sample ==");

  const openai = new OpenAI();

  const text = (
    await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
    })
  ).text as unknown as string;
  console.log(`Transcription: ${text}`);

  // ---   get chat completion from Azure OpenAI ----

  const messages: OpenAI.Chat.ChatCompletionCreateParams["messages"] = [
    {
      role: "assistant",
      content:
        "You are a helpful assistant. You will answer questions and reply I cannot answer that if you dont know the answer.",
    },
    { role: "user", content: text },
  ];

  console.log(`Messages: ${messages.map((m) => m.content).join("\n")}`);

  const completions = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages,
    max_tokens: 200,
  });

  console.log("chatbot: ", completions.choices[0].message?.content);

  const response = completions.choices[0].message?.content;

  console.log(prevState.sender, "+++", text);
  return {
    sender: text,
    response: response,
    id: id,
  };
}

export default transcript;
