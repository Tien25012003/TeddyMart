import { Button, FloatButton, Tooltip } from "antd";
import { CommentOutlined, WechatOutlined } from "@ant-design/icons";
import Gemini from "./Gemini/Gemini";
export default function Chatbot() {
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
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThr7qrIazsvZwJuw-uZCtLzIjaAyVW_ZrlEQ&s"
              width={24}
              height={24}
              alt=""
            />
          </Button>
        </Tooltip>
        <Tooltip title="React Simple Chat bot library" placement="left">
          <Button
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
        <Gemini />
      </FloatButton.Group>
    </>
  );
}
