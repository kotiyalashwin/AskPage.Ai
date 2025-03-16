export const getAskPrompt = (
  context: string,
  question: string,
  suggestion: string = "false"
) => {
  return ` SUGGESTION = ${suggestion}.
  Strictly stick to the context if SUGGESTION="false" and do not give your suggestion. Only give the answer related the context provided. 
  I do not want any text from your side, simply give me the answer
   If the SUGGESTION="true", You are free to think beyond the context and answer through Global Search.
  Here is the context in which i am talking about which you saved previously. ${context}.
  Based on this context, answe me for ${question}.If you do not have the context to this question,then simply return this exact statement as your response: 'This page does not provide information about this. Try enabling GlobalSearch`;
};
