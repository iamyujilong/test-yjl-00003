const fs = require("fs");
const p = "E:\\AI Coding\\test-yjl-00003\\api\\routes\\master.ts";
let c = fs.readFileSync(p, "utf8");
const lines = c.split("\n");
const result = [];
let inUsersPost = false;
let braceCount = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes("router.post('/master/users'")) {
    inUsersPost = true;
    braceCount = 0;
  }
  
  if (inUsersPost) {
    if (line.includes("const hash = bcrypt.hashSync")) {
      result.push(line);
      continue;
    }
    if (line.includes("db.run('INSERT INTO users")) {
      result.push("  db.run('INSERT INTO users (username, password, role, email, name, status) VALUES (?, ?, ?, ?, ?, ?)',");
      continue;
    }
    if (line.trim().startsWith("[username, hash")) {
      result.push("    [username, hash, role, email, name, status],");
      continue;
    }
    if (line.includes("function (err) {")) {
      result.push(line);
      continue;
    }
    if (line.includes("if (err) {") && braceCount >= 3) {
      result.push(line);
      continue;
    }
    if (line.includes("return res.status(500)") && braceCount >= 3) {
      result.push(line);
      continue;
    }
    if (line.includes("res.json({ status: 'ok'") && line.includes("this.lastID") && braceCount >= 3) {
      result.push("      res.json({ status: 'ok', data: { id: this.lastID, username } })");
      continue;
    }
    if (line.trim() === "})" && braceCount >= 4) {
      result.push("    })");
      inUsersPost = false;
      continue;
    }
    if (line.trim() === "})") {
      braceCount++;
    }
    if (line.trim() === "})" && i < lines.length - 1 && lines[i+1].includes("router.get('/master/roles'")) {
      result.push("})");
      inUsersPost = false;
      continue;
    }
    continue;
  }
  
  if (line.trim() === "})" && i > 0 && lines[i-1].includes("res.json({ status: 'ok'") && lines[i-1].includes("this.lastID")) {
    continue;
  }
  
  result.push(line);
}
fs.writeFileSync(p, result.join("\n"), "utf8");
console.log("Fixed master.ts: " + lines.length + " -> " + result.length + " lines");
