
function main() {
    const s = document.createElement("script")
    s.type = "text/javascript"
    s.async = true 
    s.src = chrome.runtime.getURL('main.js')
    document.documentElement.appendChild(s) 
}

main()