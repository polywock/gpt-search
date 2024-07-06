
// /// <reference types="@types/node" />

// Test to make sure all locales have the required strings.

const { readFileSync } = require("fs")
const { exit } = require("process")

const locales = ["en", "it", "es", "ja", "ko", "pt_BR", "ru", "tr", "zh_CN", "zh_TW"]

let targetLeaves;

for (let locale of locales) {
  let leaves; 
  try {
    leaves = getLeafs(JSON.parse(readFileSync(`./static/locales/${locale}.json`, {encoding: "utf8"})))
  } catch (err) {
    console.log("Could not parse", locale, leaves)
    exit()
  }

  if (!targetLeaves) {
    targetLeaves = leaves;
    continue 
  }


  const omitted = new Set(targetLeaves.filter(v => !leaves.includes(v)))
  const extra = new Set(leaves.filter(v => !targetLeaves.includes(v)))

  omitted.forEach(o => o.startsWith("_") && omitted.delete(o))
  extra.forEach(o => o.startsWith("_") && extra.delete(o))

  if (omitted.size) {
    console.log("OMITTED", "\n=========")
    omitted.forEach(v => console.log(v))
  }

  if (extra.size) {
    console.log("\nEXTRA", "\n=========")
    extra.forEach(v => console.log(v))
  }

  if (omitted.size + extra.size ) {
    console.log("\nFIX", locale)
    exit()
  }
}

console.log("ALL GOOD!")

function getLeafs(obj, ctx = []) {
  const leafs = []
  for (let [k, v] of Object.entries(obj)) {
    if (typeof v === "object") {
      leafs.push(...getLeafs(v, [...ctx, k]))
    } else {
      leafs.push([...ctx, k].join('.'))
    }
  }
  return leafs
}
