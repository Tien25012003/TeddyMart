import { COLORS } from "constants/colors";
import { Props } from "./props";
import TextComponent from "components/TextComponent";
import { ChangeEvent, useEffect, useRef } from "react";
import { useForm, SubmitHandler, UseFormRegister } from "react-hook-form";
/**
 * Props for a custom text input component.
 * @param labelFontWeight - Font weight of the label.
 * @param labelFontSize - Font size of the label.
 * @param labelColor - Color of the label text.
 * @param placeHolder - Placeholder text for the input.
 * @param id - The unique identifier for the input.
 * @param inputType - Type of the input element (e.g., text, checkbox, radio, etc.).
 * @param borderRadius - Border radius of the input component.
 * @param label - Text to be displayed as the label.
 * @param width - Width of the input component.
 * @param textInputColor - Color of the input text.
 * @param borderColor - Border color of the input component.
 * @param textInputSize - Size of the input text.
 * @param icon - Icon element to be displayed alongside the input.
 * @param onIconClick - Callback function to be invoked when the icon is clicked.
 * @param required - Indicates if the input is required.
 * @param value - The current value of the input.
 * @param setValue - Function to update the value of the input.
 * @param outerStyle - style outline of textinput
 * @param enterAction - hanlde enter press
 * @param disabled - disable the input
 */
export default function TextInputComponent({
  labelFontWeight = "font-medium",
  labelFontSize = 12,
  labelColor = COLORS.defaultBlack,
  placeHolder = "",
  id,
  inputType = "text",
  label,
  borderRadius = 5,
  width = 200,
  textInputColor = COLORS.defaultBlack,
  borderColor = "gray",
  textInputSize = "16px",
  icon,
  onIconClick = () => {},
  required = false,
  value,
  setValue,
  iconLeft,
  style,
  outStyle,
  register,
  registerName,
  readOnly = false,
  onClick = () => {},
  enterAction = () => {},
  pattern,
  minLength,
  disabled = false,
  min,
  rightContent,
}: Props) {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  return (
    <div style={{ width: width, ...outStyle }} className="relative">
      {label && (
        <div className="absolute -top-3 left-2 bg-white text-10 px-1 font-roboto text-txt_lightgrey">
          <TextComponent
            fontSize={labelFontSize}
            fontWeight={labelFontWeight}
            color={labelColor}
          >
            {label}
          </TextComponent>
        </div>
      )}
      <div
        className={`flex items-center outline outline-1 outline-gray-300 p-2 focus-within:outline-2 focus-within:outline-black w-full border-${borderColor}`}
        style={{ borderRadius: borderRadius, ...style }}
      >
        {iconLeft && <button>{iconLeft}</button>}

        {register ? (
          <input
            disabled={disabled}
            type={inputType}
            id={id}
            className={`bg-gray-50 block w-full focus:outline-none py-1`}
            placeholder={placeHolder}
            required={required}
            style={{ fontSize: textInputSize, color: textInputColor }}
            {...(register &&
              register(registerName, {
                required: required,
                pattern: pattern,
                minLength: minLength,
              }))}
            readOnly={readOnly}
            onClick={onClick}
            min={min}
          />
        ) : (
          <input
            disabled={disabled}
            type={inputType}
            id={id}
            className={`bg-gray-50 block w-full focus:outline-none py-1`}
            placeholder={placeHolder}
            required={required}
            value={value}
            onChange={handleInputChange}
            style={{
              fontSize: textInputSize,
              color: textInputColor,
              cursor: disabled ? "not-allowed" : undefined,
              opacity: disabled ? 0.5 : 1,
            }}
            readOnly={readOnly}
            onClick={onClick}
            onKeyDownCapture={(e) => {
              if (e.key === "Enter") enterAction();
            }}
            min={min}
          />
        )}

        {icon && (
          <button
            onClick={(e) => {
              onIconClick();
              e.preventDefault();
            }}
            className="p-2 hover:bg-extreme_lg_grey rounded-full"
          >
            {icon}
          </button>
        )}
        {rightContent ?? rightContent}
      </div>
    </div>
  );
}
