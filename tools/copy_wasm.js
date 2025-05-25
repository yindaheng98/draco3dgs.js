const fs = require('fs');
const path = require('path');

const srcRoot = path.join(__dirname, '../');
const dstRoot = path.join(__dirname, '../' + process.argv[2]);
fs.cpSync(path.join(srcRoot, "draco3d"), path.join(dstRoot, "draco3d"), { recursive: true })
