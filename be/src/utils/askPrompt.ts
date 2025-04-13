export const getAskPrompt = (
  context: string,
  question: string,
  suggestion: string
) => {
  return ` SUGGESTION = ${suggestion}.
   Strictly stick to the context if SUGGESTION="false" and do not give your suggestion. Only give the answer related the context provided. 
   I do not want any text from your side, simply give me the answer
    If the SUGGESTION="true", You are free to think beyond the context and answer through Global Search.
   Here is the context in which i am talking about which you saved previously. ${context}.
   Based on this context, answer me for ${question}.If you do not have the context to this question,then simply return this exact statement as your response: 'This page does not provide information about this. Try enabling GlobalSearch`;
  //   return `
  // ${
  //   suggestion === "false"
  //     ? `Provide  answer strictly based on the provided context. Do not include any information outside of the context.You may act as a Chatbot AI and answer questions in a more human manner. Do not offer suggestions or additional information.Here is the context: ${context}.
  // Based on this context, answer the following question: ${question}.`
  //     : // If you do not have the context to answer this question, then return this exact statement as your response: 'This page does not provide information about this. Try enabling GlobalSearch'.`
  //       `Provide a concise comprehensive answer.You are not bound to any context and you can use the internet for the results.You may use your general knowledge and reasoning abilities to expand on the question and think beyond the context. Here is the question :${question}`
  // }

  //  `;
};
