import copy from "copy-to-clipboard";
import { readFileSync } from "fs";
const text = readFileSync("test.txt").toString();
copy(text);
