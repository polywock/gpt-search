
export function getElapsed(rb: number, locale: string) {
    const d = new Date(rb);
    const sameYear = new Date().getFullYear() === d.getFullYear();

    const r = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    const seconds = (Date.now() - rb) / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const years = days / 365;
    const weeks = years * 52;

    if (days < 14) {
        return r.format(-Math.round(days), 'days');
    } else if (weeks < 4) {
        return r.format(-Math.round(weeks), 'weeks');
    } else if (days < 60) {
        return d.toLocaleDateString(locale, { month: 'long', day: 'numeric' });
    } else if (sameYear) {
        return d.toLocaleDateString(locale, { month: 'long' });
    } else {
        return d.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
    }
}
