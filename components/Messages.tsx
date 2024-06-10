import { Message } from "@/app/page";
import SubmitButton from "./SubmitButton";
import { ChevronDownCircle } from "lucide-react";

interface Props {
  messages: Message[];
}

function Messages({ messages }: Props) {
  return (
    <div className={`flex flex-col`}>
      {!messages.length && (
        <div className="flex justify-center items-center">
          <div className="flex mt-auto items-center flex-col justify-center gap-6 pt-10">
            <p className="text-gray-100 animate-pulse text-lg">
              Start a conversation
            </p>
            <ChevronDownCircle
              size={64}
              className="animate-bounce text-gray-100"
            />
          </div>
        </div>
      )}
      <div className="flex flex-1 space-y-5 max-w-3xl mx-auto">
        <SubmitButton />

        <div className="p-5 space-y-5 flex">
          {messages.map((message) => (
            <div key={message.id} className="space-y-5">
              {/* sender */}
              <div className="pl-10">
                <p className="message border border-purple-300 text-left ml-auto rounded-br-none">
                  {message.sender}
                </p>
              </div>
              {/* reciever */}
              <div className="pr-10">
                <p className="message bg-gray-800 rounded-bl-none">
                  {message.response}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Messages;
