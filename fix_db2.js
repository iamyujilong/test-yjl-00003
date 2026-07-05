const fs = require("fs");
const p = "E:\\AI Coding\\test-yjl-00003\\api\\database.ts";
let c = fs.readFileSync(p, "utf8");

// Replace double-quoted column names and string values with proper single quotes
c = c.replace(/"created_at"/g, "created_at");
c = c.replace(/"updated_at"/g, "updated_at");
c = c.replace(/"active"/g, "'active'");
c = c.replace(/"pending"/g, "'pending'");
c = c.replace(/"new"/g, "'new'");
c = c.replace(/"paid"/g, "'paid'");
c = c.replace(/"in_stock"/g, "'in_stock'");
c = c.replace(/"out_stock"/g, "'out_stock'");
c = c.replace(/"empty"/g, "'empty'");
c = c.replace(/"occupied"/g, "'occupied'");

fs.writeFileSync(p, c, "utf8");
console.log("Fixed database.ts");
