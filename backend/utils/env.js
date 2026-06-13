import fs from "fs";
import path from "path";

import rootDir from "./pathUtil.js";

const envFiles = [path.join(rootDir, ".env"), path.join(rootDir, "backend", ".env")];

const parseValue = (value) => {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
};

for (const envFile of envFiles) {
  if (!fs.existsSync(envFile)) {
    continue;
  }

  const contents = fs.readFileSync(envFile, "utf8");
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    let key = trimmed.slice(0, separatorIndex).trim();
    if (key.startsWith("export ")) {
      key = key.slice(7).trim();
    }

    if (!key || process.env[key] !== undefined) {
      continue;
    }

    process.env[key] = parseValue(trimmed.slice(separatorIndex + 1));
  }
}
