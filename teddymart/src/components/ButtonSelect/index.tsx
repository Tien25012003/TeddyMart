import { Button, Select } from "antd";
import React from "react";
type Props = {
  width?: number | string;
  iconRight?: React.ReactNode;
  title?: string;
  label?: string;
  options?: string[] | number[];
  setValue?: (value: any) => void;
  value?: string | number;
  minWidth?: number | string;
};
export default function ButtonSelect({
  iconRight,
  title = "Title",
  label = "Label",
  options = [],
  setValue,
  value,
  width = 120,
  minWidth = 120,
}: Props) {
  return (
    <div className=" px-2 py-2">
      <button className="relative w-full">
        {options?.length !== 0 ? (
          <Select
            placeholder={title}
            value={value}
            style={{ minWidth: width, width: width, textAlign: "left" }}
            className="flex items-start"
            onChange={(value) => setValue(value)}
          >
            {options.map((option, i) => {
              return <div key={i}>{option}</div>;
            })}
          </Select>
        ) : (
          <Button className="flex items-center">
            <div>{title}</div>
            {iconRight && iconRight}
          </Button>
        )}
        {label && (
          <div className="absolute -top-2 left-2 bg-white text-10 px-1 font-roboto text-txt_lightgrey">
            {label}
          </div>
        )}
      </button>
    </div>
  );
}
