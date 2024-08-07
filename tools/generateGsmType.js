// /// <reference types="@types/node" />

const { access, constants, writeFile, readFile } = require("fs").promises
const { join } = require("path")

const EN_PATH = join("static", "locales", "en.json")
const GSM_PATH = join("src", "utils", "GsmType.ts")


let newData = ""
async function main() {
    if (!await pathExists(EN_PATH)) return console.error("en.json does not exist")
    const data = JSON.parse( await readFile(EN_PATH, {encoding: "utf8"}))
    walk(data)
    writeFile(GSM_PATH, newData, {encoding: "utf8"})
}

function walk(d, level = 0) {
    if (level === 0) newData =  "\nexport type Gsm = {"
    const e = Object.entries(d)
    for (let i = 0; i < e.length; i++) {
        let postfix = (i === e.length - 1) ? "" : ","
        let l = level + 1 
        let p = "\n".concat(" ".repeat(l * 2))
        let isOptional = e[i][0].startsWith("_")

        const type = typeof e[i][1]
        if (type !== "object") {
            newData = newData.concat(p, e[i][0], isOptional ? "?" : "",  `: ${type}`, postfix)
        } else if (Array.isArray(e[i][1])) {
            newData = newData.concat(p, e[i][0], ": {")
            walk(e[i][1][0], l)
            newData = newData.concat(p, "}[]", postfix)
        } else {
            newData = newData.concat(p, e[i][0], ": {")
            walk(e[i][1], l)
            newData = newData.concat(p, "}", postfix)
        }
    }
    if (level === 0) newData = newData.concat("\n}")
}

async function pathExists(path) {
    try {
        await access(path, constants.W_OK)
        return true 
    } catch (err) {
        return false 
    }
}

main()