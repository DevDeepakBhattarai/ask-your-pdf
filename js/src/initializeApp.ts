import { sleep } from "../utils/sleep";
import { writeFileSync } from "fs";
import { closeRadixModal } from "./closeRadix";
import puppeteer from "puppeteer-extra";
import extraStealth from "puppeteer-extra-plugin-stealth";
import captcha from "puppeteer-extra-plugin-recaptcha";
import { setCookies } from "./setCookies";
import { Login } from "./login";

export async function initializeApp() {
  puppeteer.use(extraStealth()).use(captcha());
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const isCookieAvailable = await setCookies(page);
  await page.goto("https://chat.openai.com");
  if (!isCookieAvailable) await Login(page);
  await sleep(2000);
  if (!isCookieAvailable) {
    const browserCookies = await page.cookies();
    writeFileSync("cookies.json", JSON.stringify(browserCookies));
  }
  await closeRadixModal(page);
  await page.evaluate(observeTheMainMessageContainer);
  return page;
}

export function observeTheMainMessageContainer() {
  function observe(mutation: MutationRecord[]) {
    if (mutation[1]?.addedNodes?.[0] && mutation.length === 2) {
      const childToObserve =
        mutation[1].addedNodes[0].firstChild?.lastChild?.firstChild?.firstChild;
      const wrapperObserver = new MutationObserver((mutation) => {
        if (mutation[0].type === "attributes") {
          console.log((mutation[0].target as HTMLDivElement).innerText);
        }
      });

      if (childToObserve) {
        wrapperObserver.observe(childToObserve, {
          attributes: true,
          subtree: true,
        });
      }
    }
  }
  const chatContainer = document.querySelector(
    "#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.flex-1.overflow-hidden > div > div > div"
  );

  if (chatContainer) {
    const observer = new MutationObserver(observe);
    observer.observe(chatContainer, {
      childList: true,
    });
  }
}
