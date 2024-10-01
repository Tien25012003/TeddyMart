import { GOOGLE_API_KEY } from "constants/keys";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getDataSet } from "./helpers/getDataSet";
import { Button } from "antd";
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const generationConfig = {
  maxOutputTokens: 200,
  temperature: 0.9,
};
const model = genAI.getGenerativeModel({
  model: "gemini-pro",
  generationConfig,
});
const Gemini = () => {
  const question = "What is Teddy Mart?"; // hash code
  const generateChat = async () => {
    try {
      const parts = [{ text: await getDataSet({ question }) }];
      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
      });
      console.log(
        "result",
        result?.response?.candidates![0].content.parts[0].text
      );
      if (result?.response?.candidates) {
        if (
          result?.response?.candidates![0].content.parts[0].text ===
          "Sorry! I do not have enough information to answer this question"
        ) {
          const result = await model.generateContent(question); // follow gemini, not use data set
          const response = await result.response;
          const text = response.text();
          console.log("text", text);
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  return <Button onClick={generateChat}>Gemini</Button>;
};

export default Gemini;
