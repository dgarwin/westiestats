var fs = require('fs');
const DATA_DIR = 'data'
async function main(){
    const ret = {};
    const files = fs.readdirSync(DATA_DIR);
    for (const f of files){
        const dash = f.indexOf('-');
        const underscore = f.indexOf('_');
        const js = f.indexOf('.json');
        const start = parseInt(f.substr(underscore+1, dash));
        const end = parseInt(f.substr(dash+1, js - dash));
        if (start === NaN || end === NaN){
            console.log(`${f} is invalid. Skipping...`)
        }
        const data = JSON.parse(fs.readFileSync(`${DATA_DIR}/regPoints_${start}-${end}.json`));
        for (const key of Object.keys(data)){
            const obj = data[key];
            if (!(Object.keys(obj).length === 0 && obj.constructor === Object)){
                ret[key] = obj;
            }
        }
    }
    fs.writeFileSync(`${DATA_DIR}/regPoints_full.json`, JSON.stringify(ret));
    console.log(Object.keys(ret).length);
}
main();