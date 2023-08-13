const util = require("util");
const exec = util.promisify(require("child_process").exec);

export async function copyToClipboard(text: string) {
  try {
    // Use xclip command to copy the text to clipboard
    await exec(`echo ${text} | clip`);
    console.log("Text copied to clipboard successfully");
  } catch (error) {
    console.error("Error copying text to clipboard:", error);
  }
}
