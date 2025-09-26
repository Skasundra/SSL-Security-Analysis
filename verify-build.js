import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, 'Frontend', 'dist');

console.log('🔍 Verifying build...');
console.log('📁 Checking path:', distPath);

if (fs.existsSync(distPath)) {
  console.log('✅ Frontend dist folder exists');
  
  const files = fs.readdirSync(distPath);
  console.log('📄 Files in dist folder:');
  files.forEach(file => {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);
    console.log(`  - ${file} (${stats.size} bytes)`);
  });
  
  // Check for index.html
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log('✅ index.html found');
    const content = fs.readFileSync(indexPath, 'utf8');
    console.log('📝 index.html preview:');
    console.log(content.substring(0, 200) + '...');
  } else {
    console.log('❌ index.html not found');
  }
  
} else {
  console.log('❌ Frontend dist folder not found!');
  console.log('📁 Available directories:');
  const frontendPath = path.join(__dirname, 'Frontend');
  if (fs.existsSync(frontendPath)) {
    const dirs = fs.readdirSync(frontendPath);
    dirs.forEach(dir => console.log(`  - ${dir}`));
  }
}