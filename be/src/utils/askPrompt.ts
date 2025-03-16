export const getAskPrompt = (
  context: string,
  question: string,
  suggestion: string
) => {
  return `
${
  suggestion === "false"
    ? `Provide  answer strictly based on the provided context. Do not include any information outside of the context. Do not offer suggestions or additional information.Here is the context: ${context}.
Based on this context, answer the following question: ${question}.
If you do not have the context to answer this question, then return this exact statement as your response: 'This page does not provide information about this. Try enabling GlobalSearch'.`
    : `Provide a concise comprehensive answer. You may use your general knowledge and reasoning abilities to expand on the question and think beyond the context. Here is the question :${question}`
}

I do not want any additional text from your side. Simply provide the answer. `;
};
