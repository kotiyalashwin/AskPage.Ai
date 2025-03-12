export const extractCommands = (
  text: string
): { commands: string[]; remainingText: string } => {
  // Match text between ```bash and ``` or $ at start of line
  const bashBlockRegex = /```bash\n([\s\S]*?)```/g;
  const commandLineRegex = /^\s*\$\s*(.+)$/gm;

  let commands: string[] = [];
  let remainingText = text;

  // Extract commands from bash blocks
  const bashBlocks = text.match(bashBlockRegex);
  if (bashBlocks) {
    bashBlocks.forEach((block) => {
      const blockContent = block.replace(/```bash\n|```/g, "").trim();
      commands = [...commands, ...blockContent.split("\n")];
      remainingText = remainingText.replace(block, "");
    });
  }

  // Extract commands starting with $
  const commandLines = text.match(commandLineRegex);
  if (commandLines) {
    commandLines.forEach((line) => {
      const command = line.replace(/^\s*\$\s*/, "").trim();
      commands.push(command);
      remainingText = remainingText.replace(line, "");
    });
  }

  return {
    commands: commands.filter((cmd) => cmd.trim() !== ""),
    remainingText: remainingText.trim(),
  };
};
