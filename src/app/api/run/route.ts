import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const { code, language } = await req.json();

  const tmpDir = './tmp';
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

  const id = Date.now();
  let filePath, command;

  if (language === 'javascript') {
    filePath = path.join(tmpDir, `${id}.js`);
    fs.writeFileSync(filePath, code);
    command = `node "${filePath}"`;
  } else if (language === 'python') {
    filePath = path.join(tmpDir, `${id}.py`);
    fs.writeFileSync(filePath, code);
    command = `python3 "${filePath}"`;
  } else if (language === 'c') {
    filePath = path.join(tmpDir, `${id}.c`);
    const exePath = path.join(tmpDir, `${id}.out`);
    fs.writeFileSync(filePath, code);
    command = `gcc "${filePath}" -o "${exePath}" && "${exePath}"`;
  } else {
    return NextResponse.json({ output: ["Unsupported language"] });
  }

  return new Promise((resolve) => {
    exec(command, { timeout: 3000 }, (err, stdout, stderr) => {
      const result = [];
      if (stdout) result.push(stdout.trim());
      if (stderr) result.push(stderr.trim());
      if (err && !stderr) result.push(err.message);

      fs.unlinkSync(filePath);
      if (language === 'c' && fs.existsSync(`${tmpDir}/${id}.out`)) {
        fs.unlinkSync(`${tmpDir}/${id}.out`);
      }

      resolve(NextResponse.json({ output: result }));
    });
  });
}
