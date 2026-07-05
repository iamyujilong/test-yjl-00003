const fs = require("fs");
const p = "E:\\AI Coding\\test-yjl-00003\\api\\routes\\orders.ts";
let c = fs.readFileSync(p, "utf8");
c = c.replace(/'订单不存在'\?/g, "'订单不存在'");
fs.writeFileSync(p, c, "utf8");
console.log("Fixed trailing ?");
