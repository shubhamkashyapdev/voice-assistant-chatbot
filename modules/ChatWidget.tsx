"use client";
import transcript from "@/actions/transcript";
import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChatMessages from "./components/ChatMessages";
import ChatHeader from "./components/ChatHeader";
import Image from "next/image";
import { nanoid } from "nanoid";
import { useFormState } from "react-dom";
import { MessageItem } from "@/types";
import Recorder from "@/components/Recorder";
import VoiceSynthesizer from "@/components/VoiceSynthesizer";

const initialState = {
  sender: "",
  response: "",
  id: "",
};

const Chat = () => {
  const [state, formAction] = useFormState(transcript, initialState);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [displaySettings, setDisplaySettings] = useState(false);

  const [isOpen, setIsOpen] = useState(true);
  const [isShown, setIsShown] = useState(false);

  const toggleChat = () => {
    if (isShown) {
      setIsShown(false);
    }
    setIsOpen(!isOpen);
  };

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

  return (
    <div>
      <AnimatePresence>
        {isOpen && (
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
            className="absolute bottom-16 right-0 bg-white border border-gray-200 rounded-md shadow-md w-[375px] h-[70vh] max-h-[500px] flex flex-col"
          >
            <ChatHeader />
            <hr />

            <ChatMessages messages={messages} />

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
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        className="text-white rounded-full m-shadow-project-card"
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Image
          src={"/chatbot.png"}
          height={45}
          width={45}
          alt={""}
          className="rounded-full"
        />
      </motion.button>
    </div>
  );
};

export default Chat;
