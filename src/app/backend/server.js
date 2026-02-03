// const express = require('express');
// const bodyParser = require('body-parser');
// const { exec } = require('child_process');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// app.use(bodyParser.json());

// app.post('/api/run', (req, res) => {
//   const { language, code } = req.body;
//   if (!code) return res.json({ output: ["No code provided"] });

//   const tmpDir = './tmp';
//   if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

//   const id = Date.now();
//   let filePath, command;

//   if (language === 'javascript') {
//     filePath = path.join(tmpDir, `${id}.js`);
//     fs.writeFileSync(filePath, code);
//     command = `node "${filePath}"`;
//   } else if (language === 'python') {
//     filePath = path.join(tmpDir, `${id}.py`);
//     fs.writeFileSync(filePath, code);
//     command = `python3 "${filePath}"`;
//   } else if (language === 'c') {
//     filePath = path.join(tmpDir, `${id}.c`);
//     const exePath = path.join(tmpDir, `${id}.out`);
//     fs.writeFileSync(filePath, code);
//     command = `gcc "${filePath}" -o "${exePath}" && "${exePath}"`;
//   } else {
//     return res.json({ output: ["Unsupported language"] });
//   }

//   exec(command, { timeout: 3000 }, (err, stdout, stderr) => {
//     const result = [];
//     if (stdout) result.push(stdout.trim());
//     if (stderr) result.push(stderr.trim());
//     if (err && !stderr) result.push(err.message);
//     res.json({ output: result });
    
//     // Cleanup
//     fs.unlinkSync(filePath);
//     if (language === 'c' && fs.existsSync(`${tmpDir}/${id}.out`)) {
//       fs.unlinkSync(`${tmpDir}/${id}.out`);
//     }
//   });
// });

// app.listen(3000, () => console.log('Server running on http://localhost:3000'));
