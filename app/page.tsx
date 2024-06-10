"use client";

import transcript from "@/actions/transcript";
import { useFormState } from "react-dom";
import { useEffect, useRef, useState } from "react";
import Recorder from "@/components/Recorder";
import VoiceSynthesizer from "@/components/VoiceSynthesizer";
import { SettingsIcon } from "lucide-react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import ChatHeader from "@/modules/components/ChatHeader";
import ChatMessages from "@/modules/components/ChatMessages";

const initialState = {
  sender: "",
  response: "",
  id: "",
};

export type Message = {
  sender: string;
  response: string;
  id: string;
};

export default function Home() {
  const [state, formAction] = useFormState(transcript, initialState);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [displaySettings, setDisplaySettings] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    if (isOpen) {
      setIsOpen(false);
    }
    setIsOpen(!isOpen);
  };

  // Responsible for updating the messages when the Server Action completes
  useEffect(() => {
    if (state.response && state.sender) {
      setMessages((messages) => [
        {
          sender: state.sender || "",
          response: state.response || "",
          id: state.id || "",
        },
        ...messages,
      ]);
    }
  }, [state]);

  const uploadAudio = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;

    // Create a File object from the Blob
    const file = new File([blob], "audio.webm", { type: blob.type });

    // Set the file as the value of the file input element
    if (fileRef.current) {
      // Create a DataTransfer object to simulate a file input event
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileRef.current.files = dataTransfer.files;

      // Submit the form
      if (submitButtonRef.current) {
        submitButtonRef.current.click();
      }
    }
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollBy({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <main className="bg-black min-h-screen relative">
      <header className="flex fixed top-0 justify-between text-white w-full p-5">
        <div></div>
        <SettingsIcon
          className="p-2 m-2 rounded-full cursor-pointer bg-purple-600 text-black transition-all ease-in-out duration-150 hover:bg-purple-700 hover:text-white"
          onClick={() => setDisplaySettings(!displaySettings)}
          size={40}
        />
      </header>
      <form action={formAction} className="fixed bottom-8 right-8">
        <AnimatePresence>
          {isOpen ? (
            <motion.div
              initial={{
                scale: 0,
                opacity: 0.5,
                transformOrigin: "bottom right",
              }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{
                scale: 0,
                opacity: 0.5,
                transformOrigin: "bottom right",
              }}
              className="absolute bottom-16 right-0 bg-gradient-to-b from-purple-500 to-black rounded-md shadow-md w-[375px] h-[70vh] max-h-[700px] flex flex-col overflow-hidden"
            >
              {/* <ChatHeader /> */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-auto py-6 no-scrollbar"
              >
                <ChatMessages messages={messages} />
              </div>
              {/* Input */}
              <div className="mt-auto">
                <input type="file" name="audio" ref={fileRef} hidden />
                <button type="submit" hidden ref={submitButtonRef} />

                <div className="w-full bg-gradient-to-b from-black/90 to-black">
                  <Recorder uploadAudio={uploadAudio} />
                  <div className="">
                    <VoiceSynthesizer
                      state={state}
                      displaySettings={displaySettings}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
          <motion.div
            onClick={toggleChat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-white rounded-full m-shadow-project-card"
          >
            <Image
              src={"/chatbot.png"}
              height={45}
              width={45}
              alt={""}
              className="rounded-full"
            />
          </motion.div>
        </AnimatePresence>
      </form>
      {/* <form action={formAction} className="flex flex-col bg-black">
        <div className="bg-gradient-to-b from-purple-500 to-black">
          <Messages messages={messages} />
        </div>

        <div className="mt-auto flex-1 h-[30%]">
          <input type="file" name="audio" ref={fileRef} hidden />
          <button type="submit" hidden ref={submitButtonRef} />

          <div className="w-full bg-black rounded-t-3xl">
            <Recorder uploadAudio={uploadAudio} />
            <div className="">
              <VoiceSynthesizer
                state={state}
                displaySettings={displaySettings}
              />
            </div>
          </div>
        </div>
      </form> */}
    </main>
  );
}
