const fs = require("fs");
const p = "E:\\AI Coding\\test-yjl-00003\\api\\routes\\orders.ts";
let c = fs.readFileSync(p, "utf8");
// Fix unterminated string literals - Chinese characters with broken quotes
c = c.replace(/'璁㈠崟涓嶅瓨鍦?/g, "'订单不存在'");
fs.writeFileSync(p, c, "utf8");
console.log("Fixed orders.ts encoding");
