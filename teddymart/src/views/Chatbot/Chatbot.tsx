import { Button, FloatButton, Tooltip } from "antd";
import React, { useRef, useState } from "react";
import Modal from "antd/es/modal/Modal";
import OCR from "./OCR/OCR";
import ChatbotKit from "./ChatbotKit";
import GeminiChatbot from "./Gemini";
export default function Chatbot() {
  const [showChat, setShowChat] = useState(false);
  const [openOCR, setOpenOCR] = useState(false);
  const [open, setOpen] = useState(false);

  const toggleChat = () => {
    setShowChat(!showChat);
  };

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
        //icon={<CommentOutlined style={{ fontSize: "20px" }} />}
        //className="custom-float-button"
        type="primary"
      >
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
      </FloatButton.Group>

      <GeminiChatbot open={showChat} onClose={toggleChat} />
      <Modal footer={false} open={open} onOk={hideModal} onCancel={hideModal}>
        <ChatbotKit />
      </Modal>
      <OCR open={openOCR} onClose={() => setOpenOCR(false)} />
    </>
  );
}
