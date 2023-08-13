import { Page } from "puppeteer";
import { sleep } from "../utils/sleep";
export async function askGPT(page: Page, prompt: string) {
  await page.evaluate((prompt: string) => {
    console.log("I ran");
    window.navigator.clipboard
      .writeText(prompt)
      .then(() => {
        console.log("Copied");
      })
      .catch((e) => {
        console.log(e);
      });
  }, sanitizeStringForClipboard(prompt));
  await page.focus("textarea");
  await page.keyboard.down("ControlLeft");
  await page.keyboard.press("v");
  await page.keyboard.up("ControlLeft");
  await sleep(100);
  await page.waitForSelector(
    "#__next > div > div > div > main > div > form > div > div > button"
  );

  await page.click(
    "#__next > div > div > div > main > div > form > div > div > button"
  );

  const finalAnswer = await new Promise<string>((resolve) => {
    page.on("console", (value) => {
      resolve(value.text());
    });
  });

  return finalAnswer!;
}
function sanitizeStringForClipboard(input: string): string {
  // Define a regular expression that matches non-printable ASCII characters excluding new lines
  const forbiddenChars = /[^\x20-\x7E\r\n]/g;

  // Remove or replace forbidden characters
  const sanitizedString = input.replace(forbiddenChars, "");

  return sanitizedString;
}
