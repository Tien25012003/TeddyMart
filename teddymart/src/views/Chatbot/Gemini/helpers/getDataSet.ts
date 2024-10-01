import { getData } from "controller/getData";
type TQuestion = {
  question?: string;
};
export const getDataSet = async ({ question }: TQuestion) => {
  const result = await getData("/Chatbot");
  const dataSet = result[0].dataSet?.concat(
    `---
  User's question: 
  Question:  ${question}`
  );
  return dataSet;
};
