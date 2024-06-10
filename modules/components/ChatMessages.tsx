"use client";

import { cn } from "@/utils";
import { FC, HTMLAttributes } from "react";
import MarkdownLite from "./MarkdownLite";
import { MessageItem } from "@/types";

interface ChatMessagesProps extends HTMLAttributes<HTMLDivElement> {
  messages: MessageItem[];
}

const ChatMessages = ({ className, ...props }: ChatMessagesProps) => {
  const inverseMessages = [...props.messages].reverse();
  return (
    <div className={cn("flex flex-1", className)}>
      <div className="p-5 space-y-5 flex flex-col flex-col-reverse">
        {inverseMessages.map((message) => {
          return (
            <div key={message.id} className="space-y-5">
              {/* sender */}
              <div className="pl-10">
                <p className="message text-left ml-auto rounded-br-none">
                  {message.sender}
                </p>
              </div>
              {/* reciever */}
              <div className="pr-10">
                <p className="message bg-purple-800rounded-bl-none">
                  {message.response}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatMessages;
