import { createRoot } from "react-dom/client";
import { loadGsm } from "../utils/gsm";
import { App } from "./App";

loadGsm().then(gsm => {
    gvar.gsm = gsm 
    if (gvar.gsm) main()
})

async function main() {
    const root = createRoot(document.querySelector('#root'))
    root.render(<App/>)
}