import { readFileSync } from "fs";
import ps from "prompt-sync";
import { askGPT } from "./src/askGPT";
import { initializeApp } from "./src/initializeApp";
import { promptTemplate } from "./utils/promptTemplate";
import express from "express";
import { Page } from "puppeteer";
import { newGPTPage } from "./src/newGPTPage";
import { z } from "zod";
import cors from "cors";
const inputSchema = z.object({
  system: z.string(),
  prompt: z.string(),
  context: z.string(),
});
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors({ origin: "*" }));
let page: Page | undefined;

app.post("/answer", async (req, res) => {
  const data = req.body;
  try {
    const { prompt, system, context } = inputSchema.parse(data);
    if (!page) {
      page = await initializeApp(); // Assuming initializeApp is defined in your GPT module
    }

    try {
      const replacements = {
        question: prompt,
        system: system,
        context: context,
      };

      const templatePrompt = readFileSync("prompt.txt").toString(); // Replace with the correct path
      const finalPrompt = promptTemplate(templatePrompt, replacements); // Assuming promptTemplate is defined in your GPT module
      const answer = await askGPT(page, finalPrompt); // Assuming askGPT is defined in your GPT module
      res.json({ answer });
    } catch (error) {
      console.error("Error generating GPT output:", error);
      res
        .status(500)
        .json({ error: "An error occurred while generating the answer." });
    }
  } catch (e) {
    res.send("Please enter valid data ").status(422);
  }
});

app.get("/new", async (req, res) => {
  console.log("Hello");
  if (page) {
    await newGPTPage(page);
  }
  res.send("Done");
});

// Start the server
app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`);
});
