export const getAskPrompt = (
  context: string,
  question: string,
  suggestion: boolean = false
) => {
  return `Here is the context in which i am talking about which you saved previously. ${context}.
  Based on this context, answe me for ${question}.

   ${
     suggestion
       ? "This question is beyong the context. Answer me based on your knowledge."
       : "Strictly stick to the context if Suggestion is false and do not give your suggestion. Only give the answer related the context provided. I do not want any text from your side, simply give me the answer"
   }`;
};
