import { config } from "dotenv";
import { writeFileSync, appendFileSync } from "fs";
import ps from "prompt-sync";
const prompt = ps();
config();
let a =
  'Sure, I can help you write a JavaScript function that wraps the text between "\\nCopy code\\n" and "\\n\\n\\n" with triple backticks (```).\n\njavascript\nCopy code\nfunction wrapCodeBlock(text) {\n  const startTag = "\\nCopy code\\n";\n  const endTag = "\\n\\n\\n";\n  const codeBlockStart = "```";\n  const codeBlockEnd = "```";\n\n  const startIndex = text.indexOf(startTag);\n  const endIndex = text.indexOf(endTag);\n\n  if (startIndex === -1 || endIndex === -1) {\n    // If the tags are not found, return the original text.\n    return text;\n  }\n\n  const beforeCode = text.substring(0, startIndex);\n  const code = text.substring(startIndex + startTag.length, endIndex);\n  const afterCode = text.substring(endIndex + endTag.length);\n\n  // Concatenate the parts with the code block formatting.\n  return beforeCode + codeBlockStart + "\\n" + code + "\\n" + codeBlockEnd + afterCode;\n}\n\n// Example usage:\nconst textWithCodeTags = `\n  // Component for the video call\n  const VideoCall = () => {\n    // Add state and event handlers for video call logic here\n    // E.g., const [isVideoOn, setVideoOn] = useState(false);\n    // Implement video streaming and interaction using WebRTC or other libraries\n    return (\n      <div>\n        {/* Your video interface elements go here */}\n        <video id="localVideo" autoPlay muted></video>\n        <video id="remoteVideo" autoPlay></video>\n      </div>\n    );\n  };\n  \n  // Main ChatApp component\n  const ChatApp = () => {\n    // You can add more state here, e.g., for managing the video call status\n    return (\n      <div>\n        <h1>Chat App with Video</h1>\n        <div>\n          {/* VideoCall component */}\n          <VideoCall />\n        </div>\n      </div>\n    );\n  };\n`;\n\nconst wrappedText = wrapCodeBlock(textWithCodeTags);\nconsole.log(wrappedText);\n\n\nPlease note that this function assumes there is only one occurrence of "\\nCopy code\\n" and "\\n\\n\\n" in the provided text. If there are multiple occurrences, the function will only wrap the first occurrence. If you need to handle multiple occurrences, you can modify the function accordingly.';
const regex = /\n\n(?!.*\.)\s*(.+):\n\n/g;
// @ts-ignore
a = a.replaceAll(regex, "\n\n## $1:\n\n");
const anotherRegex = new RegExp("\\n\n([^#.,/\n]+):", "g");
//@ts-ignore
a = a.replaceAll(anotherRegex, "\n\n- **$1**:\n");

a = wrapCodeBlock(a);

writeFileSync("test.md", a);

function wrapCodeBlock(text: string) {
  const startTag = "\nCopy code\n";
  const endTag = "\n\n\n";
  const codeBlockStart = "```";
  const codeBlockEnd = "```";

  const startIndex = text.indexOf(startTag);
  const endIndex = text.indexOf(endTag);
  console.log(startIndex, endIndex);
  if (startIndex === -1 || endIndex === -1) {
    // If the tags are not found, return the original text.
    console.log("No");
    return text;
  }

  const beforeCode = text.substring(0, startIndex);
  const code = text.substring(startIndex + startTag.length, endIndex);
  const afterCode = text.substring(endIndex + endTag.length);

  // Concatenate the parts with the code block formatting.
  return (
    beforeCode +
    startTag +
    codeBlockStart +
    "\n" +
    code +
    "\n" +
    codeBlockEnd +
    endTag +
    afterCode
  );
}
