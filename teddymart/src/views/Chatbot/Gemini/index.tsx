import { Button, Spin } from "antd";
import { COLORS } from "constants/colors";
import { Resizable } from "re-resizable";
import React, { useRef, useState } from "react";
import { SendOutlined, CloudUploadOutlined } from "@ant-design/icons";
import Gemini from "./helpers/Gemini";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_API_KEY, OCR_KEY } from "constants/keys";
import { convertImageToBase64 } from "./helpers/convertImageToBase64";

type GeminiChatbotProps = {
  open?: boolean;
  onClose?: () => void;
};

type MessageType = {
  text?: string;
  sender?: string;
  isImage?: boolean;
  imageUrl?: string;
};

const genAI = new GoogleGenerativeAI(OCR_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default function GeminiChatbot({ open, onClose }: GeminiChatbotProps) {
  const [height, setHeight] = useState(480);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([
    { text: "Hello! Can I help you?", sender: "Gemini" },
  ]);
  const [userInput, setUserInput] = useState("");
  const fileInputRef = useRef(null);

  const formatResponse = (response: string) => {
    const points = response
      .split(/(?<=[.!?])\s+/)
      .filter((point) => point.trim().length > 2);
    return (
      <div className="space-y-3 mt-3">
        {points.map((point, index) => (
          <div key={index} className="flex items-start">
            {/* <span className="mr-2 text-blue-600 font-bold">•</span> */}
            <p className="text-gray-800 leading-relaxed">{point.trim()}</p>
          </div>
        ))}
      </div>
    );
  };

  const handleSendMessage = async (
    event?: React.ChangeEvent<HTMLInputElement> | null
  ) => {
    if (!event) {
      if (userInput.trim()) {
        const newMessages = [...messages, { text: userInput, sender: "User" }];
        setMessages(newMessages);
        setLoading(true);
        setUserInput("");

        try {
          const chatbotResponse = await Gemini.generateChat(userInput);

          if (typeof chatbotResponse === "string") {
            setMessages([
              ...newMessages,
              { text: chatbotResponse, sender: "Gemini" },
            ]);
          } else {
            console.error("Gemini response is not a string:", chatbotResponse);
          }
          setLoading(false);
        } catch (error) {
          console.error("Error sending message:", error);
          setLoading(false);
        }
      }
    } else {
      if (event?.target?.files && event.target.files[0]) {
        const mimeType = event.target.files[0].type;
        const imageUrl = URL.createObjectURL(event.target.files[0]);
        const newMessages = [
          ...messages,
          {
            isImage: true,
            sender: "User",
            imageUrl,
          },
        ];
        setMessages(newMessages);
        setLoading(true);

        convertImageToBase64(event.target.files[0])
          .then(async (result) => {
            const imageBase64 = new Image();
            imageBase64.src = result as string;

            try {
              const res = await model.generateContent([
                "Convert this image to text",
                {
                  inlineData: {
                    data: (result as any)?.split(",")[1],
                    mimeType: mimeType,
                  },
                },
              ]);
              console.log("result gemini", res?.response?.text());
              const newRes =
                res?.response?.text() ||
                "Sorry! I don't have enough information to answer this. Please try again!";
              setMessages([...newMessages, { text: newRes, sender: "Gemini" }]);
              setLoading(false);
            } catch (error) {
              console.error("Error sending message:", error);
              setLoading(false);
            }
          })
          .catch(() => {
            setLoading(false);
          });
      }
    }
  };

  if (!open) return <></>;
  return (
    <div className="fixed bottom-0 right-0 mb-4 mr-4 z-50">
      <Resizable
        defaultSize={{
          width: 350,
          height: 480,
        }}
        minWidth={350}
        minHeight={400}
        maxWidth={800}
        maxHeight={700}
        className="bg-white rounded-lg shadow-lg flex flex-col"
        style={{ right: "60px" }}
        onResize={(e, direction, ref, d) => {
          setHeight(parseInt(ref.style.height.replace("px", "")));
        }}
      >
        <div
          className="text-white px-4 py-2 rounded-t-lg flex justify-between items-center"
          style={{ backgroundColor: COLORS.blue }}
        >
          {/* <h3 className="text-lg">
                {started ? `Chat with ${shopName}` : "Chat with TeddyMart"}
              </h3> */}
          <h3 className="text-lg">Chat with TeddyMart</h3>
          <button
            onClick={onClose}
            className="text-white text-2xl leading-none focus:outline-none"
          >
            &#10005;
          </button>
        </div>

        <div className="flex-1 p-4">
          <div className="flex flex-col justify-between h-full">
            <div
              className="overflow-y-auto p-4 bg-gray-100 flex-1"
              style={{ maxHeight: `${height - 120}px` }}
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === "User" ? "justify-end" : "justify-start"
                  } mb-2`}
                >
                  <div
                    className={`max-w-xs ${
                      message.sender === "User"
                        ? !message?.isImage
                          ? "bg-blue-600 text-white"
                          : "bg-white"
                        : "bg-white text-gray-700"
                    } border border-gray-300 rounded-lg p-2`}
                  >
                    {message.sender === "User" ? (
                      <>
                        {!message?.isImage ? (
                          <p className="text-base">{message.text}</p>
                        ) : (
                          <img
                            src={message?.imageUrl}
                            alt="Selected"
                            style={{
                              width: "150px",
                              maxHeight: "150px",
                              backgroundColor: COLORS.defaultWhite,
                            }}
                          />
                        )}
                      </>
                    ) : (
                      <>
                        {message.sender === "Gemini"
                          ? formatResponse(message.text)
                          : null}
                      </>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start mb-2">
                  <div className="max-w-xs bg-white text-gray-700 border border-gray-300 rounded-lg p-2 flex items-center">
                    <Spin size="small" />
                    <p className="ml-2">Loading...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 p-2 border-t border-gray-300">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-md py-2 px-3"
                placeholder="Enter message..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
              />
              <Button
                type="default"
                icon={
                  <CloudUploadOutlined
                    style={{ fontSize: "20px", color: COLORS.blue }}
                  />
                }
                className="mr-2 border-none"
                onClick={() => fileInputRef?.current?.click()}
              />

              <Button
                type="default"
                icon={
                  <SendOutlined
                    style={{ fontSize: "20px", color: COLORS.blue }}
                  />
                }
                className="mr-2 border-none"
                onClick={() => handleSendMessage(null)}
              />
            </div>
          </div>
        </div>
      </Resizable>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleSendMessage}
      />
    </div>
  );
}
