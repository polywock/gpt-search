
export function getTtl(page: number) {
    if (page < 1) return 60_000 * 10
    else if (page < 2) return 60_000 * 60 * 6 
    else if (page < 4) return 60_000 * 60 * 24 * 2
    else if (page < 12) return 60_000 * 60 * 24 * 6
    else if (page < 24) return 60_000 * 60 * 24 * 15
    else if (page < 48) return 60_000 * 60 * 24 * 30
}


