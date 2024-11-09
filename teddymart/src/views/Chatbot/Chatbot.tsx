import { Button, FloatButton, Spin, Tooltip } from "antd";
import {
  CommentOutlined,
  WechatOutlined,
  SendOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import { Resizable } from "re-resizable";
import { COLORS } from "constants/colors";
import Gemini from "./Gemini/Gemini";
import ChatbotKit from "./ChatbotKit";
import Modal from "antd/es/modal/Modal";
import { useState } from "react";
export default function Chatbot() {
  const [showChat, setShowChat] = useState(false);
  const [started, setStarted] = useState(false);
  const [shopName, setShopName] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hello! Can I help you?", sender: "Gemini" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [height, setHeight] = useState(480);
  const [loading, setLoading] = useState(false);

  const toggleChat = () => {
    setShowChat(!showChat);
  };
  const handleStartChat = () => {
    if (shopName.trim()) {
      setStarted(true);
    }
  };
  const formatResponse = (response: string) => {
    const points = response
      .split(/(?<=[.!?])\s+/)
      .filter((point) => point.trim().length > 2);

    return (
      <div>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          {points.map((point, index) => {
            const isSubPoint = point.endsWith("?");

            return (
              <li
                key={index}
                className={`text-gray-700 leading-relaxed ${
                  isSubPoint ? "pl-8 list-decimal" : ""
                }`}
              >
                {point.trim()}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const handleSendMessage = async () => {
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
  };

  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  return (
    <>
      <FloatButton.Group
        trigger="click"
        icon={<CommentOutlined style={{ fontSize: "20px" }} />}
        className="custom-float-button"
      >
        <Tooltip title="Gemini AI" placement="left">
          <Button
            shape="circle"
            className="bg-white w-[50px] h-[50px] my-4 flex items-center justify-center shadow"
            onClick={toggleChat}
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThr7qrIazsvZwJuw-uZCtLzIjaAyVW_ZrlEQ&s"
              width={24}
              height={24}
              alt=""
            />
          </Button>
        </Tooltip>
        <Tooltip title="React Simple Chat bot library" placement="right">
          <Button
            onClick={showModal}
            shape="circle"
            className="bg-white w-[50px] h-[50px] my-4 flex items-center justify-center shadow overflow-hidden"
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxu3GSa3TpWn1eWCQbeijOMM9mz-SjFEQlsIkYUVTfurV1Lv5EyHNidcxtSX1UikqHViE&usqp=CAU"
              width={40}
              height={40}
              alt=""
            />
          </Button>
        </Tooltip>
        {/* <Gemini /> */}
      </FloatButton.Group>
      {showChat && (
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
              <h3 className="text-lg">
                {started ? `Chat with ${shopName}` : "Chat with TeddyMart"}
              </h3>
              <button
                onClick={toggleChat}
                className="text-white text-2xl leading-none focus:outline-none"
              >
                &#10005;
              </button>
            </div>

            <div className="flex-1 p-4">
              {!started ? (
                <>
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThr7qrIazsvZwJuw-uZCtLzIjaAyVW_ZrlEQ&s"
                    alt="TeddyMart Logo"
                    className="mx-auto mb-4 w-16"
                  />
                  <p className="text-center text-gray-700 mb-4">
                    Please enter your Shop name
                  </p>
                  <input
                    type="text"
                    placeholder="Fill in your Shop's name"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleStartChat();
                    }}
                    className="border border-gray-300 rounded-md w-full py-2 px-3 mb-4"
                  />
                  <Button
                    type="primary"
                    className="w-full hover:bg-red-600 text-white rounded-md flex items-center justify-center py-8"
                    style={{
                      fontSize: "20px",
                      background: COLORS.blue,
                      padding: "12px 0",
                    }}
                    onClick={handleStartChat}
                  >
                    Bắt đầu
                  </Button>
                </>
              ) : (
                <div className="flex flex-col justify-between h-full">
                  <div
                    className="overflow-y-auto p-4 bg-gray-100 flex-1"
                    style={{ maxHeight: `${height - 120}px` }}
                  >
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.sender === "User"
                            ? "justify-end"
                            : "justify-start"
                        } mb-2`}
                      >
                        <div
                          className={`max-w-xs ${
                            message.sender === "User"
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-700"
                          } border border-gray-300 rounded-lg p-2`}
                        >
                          {message.sender === "User" ? (
                            <p className="text-base">{message.text}</p>
                          ) : (
                            <>
                              {message.sender === "User" ? (
                                <p className="text-base">{message.text}</p>
                              ) : (
                                <>
                                  {message.sender === "Gemini"
                                    ? formatResponse(message.text)
                                    : null}
                                </>
                              )}
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
                    ></Button>

                    <Button
                      type="default"
                      icon={
                        <SendOutlined
                          style={{ fontSize: "20px", color: COLORS.blue }}
                        />
                      }
                      className="mr-2 border-none"
                      onClick={handleSendMessage}
                    ></Button>
                  </div>
                </div>
              )}
            </div>
          </Resizable>
        </div>
      )}
      <Modal footer={false} open={open} onOk={hideModal} onCancel={hideModal}>
        <ChatbotKit />
      </Modal>
    </>
  );
}
