var fs = require('fs');
const DATA_DIR = 'data'
async function main(){
    const ret = {};
    const data = JSON.parse(fs.readFileSync(`${DATA_DIR}/regPoints_full.json`));
    console.log(Object.keys(ret).length);
}
main();