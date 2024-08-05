import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 指定图片目录
const directoryPath = path.join(__dirname, 'public/items');

// 读取目录中的文件
fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }

    // 过滤出图片文件并生成路径列表
    const imagePaths = files
        .filter(file => /\.(png|jpe?g|svg)$/.test(file))
        .map(file => `/items/${file}`);

    // 输出路径列表
    fs.writeFileSync('public/image-paths.json', JSON.stringify(imagePaths, null, 2));
});
