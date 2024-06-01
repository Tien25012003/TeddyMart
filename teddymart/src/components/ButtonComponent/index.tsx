import React from "react";
import { COLORS } from "constants/colors";
import { ButtonProps } from "./props";
import { Button, Space } from "antd";
const ButtonComponent: React.FC<ButtonProps> = ({
  color = COLORS.defaultWhite,
  label,
  onClick,
  fontWeight = "normal",
  fontSize = "16px",
  paddingHorizontal = "20",
  paddingVertical = "24",
  borderRadius = 5,
  iconLeft,
  iconRight,
  maxWidth,
  backgroundColor = COLORS.darkYellow,
  style,
  disabled = false,
}) => {
  return (
    <Button
      disabled={disabled}
      style={{
        backgroundColor: backgroundColor,
        padding: `${paddingVertical}px ${paddingHorizontal}px`,
        borderRadius: borderRadius,
        borderWidth: 0,
        fontSize: fontSize,
        maxWidth,
        color: color,
        fontWeight: fontWeight,
        ...style,
        //letterSpacing: 0.8,
      }}
      onClick={onClick}
      className={`${fontWeight} flex items-center text-white`}
    >
      {disabled && (
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            maxWidth,
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            borderRadius: +borderRadius - 1,
            borderWidth: 0,
          }}
        ></div>
      )}
      <Space>
        {iconLeft && iconLeft}
        {label}
        {iconRight && iconRight}
      </Space>
    </Button>
  );
};

export default ButtonComponent;
