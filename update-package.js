const fs = require('fs');

const filePath = 'package.json';
const oldMain = 'src/functions/*.js';
const newMain = 'Function-Worker/src/functions/*.js';

try {
  const packageData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (packageData.main === oldMain) {
    packageData.main = newMain;
    fs.writeFileSync(filePath, JSON.stringify(packageData, null, 2));
    console.log(`Updated 'main' field in package.json to: ${packageData.main}`);
  } else {
    console.log(`'main' field in package.json is not "${oldMain}", no update needed.`);
  }
} catch (error) {
  console.error('Error updating package.json:', error);
}
