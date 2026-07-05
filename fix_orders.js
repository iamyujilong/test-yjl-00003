const fs = require("fs");
const p = "E:\\AI Coding\\test-yjl-00003\\api\\routes\\orders.ts";
let c = fs.readFileSync(p, "utf8");
const lines = c.split("\n");
const result = [];
let skipNext = 0;
for (let i = 0; i < lines.length; i++) {
  if (skipNext > 0) { skipNext--; continue; }
  if (lines[i].includes("...order, items }") && lines[i].includes("\\n")) {
    result.push("      res.json({ status: 'ok', data: { ...order, items } })");
    result.push("      })");
    result.push("    })");
    result.push("  })");
    result.push("})");
    skipNext = 1;
    continue;
  }
  result.push(lines[i]);
}
fs.writeFileSync(p, result.join("\n"), "utf8");
console.log("Fixed orders.ts: " + lines.length + " -> " + result.length + " lines");
