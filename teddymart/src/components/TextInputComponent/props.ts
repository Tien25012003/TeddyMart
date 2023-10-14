import { FONT_COLOR, FONT_SIZE, FONT_WEIGHT } from "constants/fonts";
import { BORDER_RADIUS } from "constants/styles";
import { ReactNode } from "react";
export type Props = {
  labelFontWeight?: FONT_WEIGHT;
  labelFontSize?: FONT_SIZE | number | string;
  labelColor?: string;
  placeHolder?: string;
  id?: string;
  inputType?: "text" | "checkbox" | "radio" | "color" | "date" | "file";
  borderRadius?: BORDER_RADIUS;
  label?: string;
  width?: number | string;
  textInputColor?: FONT_COLOR | string;
  borderColor?: string;
  textInputSize?: string;
  icon?: ReactNode;
  onIconClick?: () => void;
  required?: boolean;
  value: string;
  setValue: (value: string) => void;
};