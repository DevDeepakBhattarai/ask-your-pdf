import { appendFileSync, readFileSync, writeFileSync } from "fs";
import ps from "prompt-sync";
import { askGPT } from "./src/askGPT";
import { initializeApp } from "./src/initializeApp";
import { formatForMarkDown } from "./utils/formatForMd";
import { promptTemplate } from "./utils/promptTemplate";
import { sleep } from "./utils/sleep";
import { loading } from "./utils/loading";
const prompt = ps();

async function run() {
  const page = await initializeApp();
  let userPrompt;
  while (true) {
    userPrompt = prompt("Enter the prompt for auto gpt : ");
    if (userPrompt == ":q") break;
    const replacements = {
      question: userPrompt,
    };
    const isLoading = loading();
    const templatePrompt = readFileSync("prompt.txt").toString();
    let finalPrompt = promptTemplate(templatePrompt, replacements);
    const questionString = await askGPT(page, finalPrompt);

    process.stdout.clearLine(0);
    console.log("\n GPT generated all the question! \n");
    writeFileSync("questions.txt", questionString);

    let questions;

    try {
      questions = JSON.parse(questionString.trim()) as Array<string>;
    } catch (e) {
      process.stdout.clearLine(0);
      console.log("GPT didn't give the correct answer");
      break;
    }

    await askGPT(
      page,
      "You can now forget all the previous instruction and answer normally"
    );

    process.stdout.clearLine(0);
    console.log("\n GPT reset \n");

    for (const question of questions) {
      const answer = await askGPT(page, question);
      const formattedAnswer = formatForMarkDown(answer);
      const answerToPutInFile =
        "# " + question + "\n\n" + formattedAnswer + "\n\n\n";
      await sleep(100);
      try {
        appendFileSync(`answers/${userPrompt}.md`, answerToPutInFile);
        process.stdout.clearLine(0);
        console.log("Answer Updated");
      } catch (error) {
        console.error("Error appending data to the file:", error);
      }
    }
    clearInterval(isLoading);
  }
}

run();
