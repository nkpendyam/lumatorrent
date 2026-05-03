import { readFileSync } from "node:fs";
const files = ["contracts/engine/openapi-lite.json", "contracts/engine/events.schema.json", "contracts/engine/errors.schema.json"];
for (const file of files) JSON.parse(readFileSync(file, "utf8"));
console.log("Engine contracts parse OK");
