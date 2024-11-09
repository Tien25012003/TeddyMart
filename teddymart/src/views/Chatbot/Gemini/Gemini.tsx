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
const Gemini = {
  // const question = "What is Teddy Mart?";
  generateChat: async (userInput: string) => {
    try {
      const parts = [{ text: await getDataSet({ question: userInput }) }];
      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
      });
      console.log(
        "result",
        result?.response?.candidates![0].content.parts[0].text
      );
      if (result?.response?.candidates && result?.response?.candidates[0]) {
        const responseText =
          result.response.candidates[0].content.parts[0].text;
        if (
          responseText ===
          "Sorry! I do not have enough information to answer this question"
        ) {
          const genimiResponse = await model.generateContent(userInput);

          const genimiText = genimiResponse.response.text();
          console.log("AI response:", genimiText);
          return genimiText;
        }
        return responseText;
      }

      return "No valid response.";
    } catch (error) {
      console.log("error", error);
    }
  },
  // return <Button onClick={generateChat}>Gemini</Button>;
};

export default Gemini;
