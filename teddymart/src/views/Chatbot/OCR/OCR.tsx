import { COLORS } from "constants/colors";
import { useRef, useState } from "react";

type OCRProps = {
  open?: boolean;
  onClose?: () => void;
};
export default function OCR({ open, onClose }: OCRProps) {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  if (!open) return <></>;
  return (
    <div className="fixed bottom-0 right-0 mb-4 mr-[78px] z-50 min-w-[350px] min-h-[400px] bg-white rounded-lg shadow-lg">
      <div
        className="text-white px-4 py-2 rounded-t-lg flex justify-between items-center"
        style={{ backgroundColor: COLORS.blue }}
      >
        <h3 className="text-lg">Gemini OCR</h3>
        <button
          onClick={onClose}
          className="text-white text-2xl leading-none focus:outline-none"
        >
          &#10005;
        </button>
      </div>

      <div className="flex p-4 h-[360px] flex-col">
        <div className="h-full overflow-y-auto bg-gray-100 w-full">
          <div>response</div>
        </div>

        <div className="flex items-center gap-x-2 border-t border-gray-300">
          <input
            type="file"
            className="flex-1 border border-gray-300 rounded-md py-2 px-3"
            placeholder="Enter message..."
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
          />
        </div>
      </div>
    </div>
  );
}
