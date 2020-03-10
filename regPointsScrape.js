const fetch = require("node-fetch");
var fs = require('fs');

// Example POST method implementation:
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    if (response.status === 404) {
        return {};
    }
    try {
        return await response.json();
    } catch (error) {
        console.log(error);
        console.log(response);
        throw error;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getStart() {
    const files = fs.readdirSync(DATA_DIR);
    let biggest = 0;
    for (const f of files){
        const dash = f.indexOf('-');
        const js = f.indexOf('.json');
        const currentMax = parseInt(f.substr(dash+1, js - dash));
        if (currentMax > biggest) {
            biggest = currentMax;
        }
    }
    return biggest + 1;
}

const DATA_DIR = 'data'
const URL = 'https://points.worldsdc.com/lookup/find';
const CAP = process.argv[3] || 500;
async function processPerson(num, _token) {
    let person = null;
    try {
        console.log(num);
        person = postData(URL, { num, _token });
        await sleep(400);
    }
    catch (error) {
        console.log(error);
    }
    return person;
}
async function main() {
    const _token = process.argv[2];
    let start = getStart();
    const dict = {};
    let num = start;
    while (true) {
        if ((num - start) == CAP) {
            console.log('Saving...');
            await fs.writeFileSync(`${DATA_DIR}/regPoints_${start}-${num - 1}.json`, JSON.stringify(dict));
            start = num;
        }
        const person = await processPerson(num, _token);
        if (person === null){
            break;
        }
        dict[num] = person;
        num++; 
    }
}
main();
