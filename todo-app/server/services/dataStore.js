const fs = require("fs/promises");
const path = require("path");

const storePath = path.join(__dirname, "..", "data", "store.json");

async function readStore() {
  const raw = await fs.readFile(storePath, "utf8");
  return JSON.parse(raw);
}

async function writeStore(data) {
  await fs.writeFile(storePath, JSON.stringify(data, null, 2), "utf8");
}

module.exports = { readStore, writeStore };