import countryFlagEmoji from "country-flag-emoji-json";

const flagToCountryMap: { [key: string]: string } = {};

countryFlagEmoji.forEach(item => {
    flagToCountryMap[item.emoji] = item.name;
});

export function getCountryNameByFlag(flag: string): string | null {
    // Trim and handle any potential skin tone modifiers
    const baseFlag = flag.replace(/[\u{1F3FB}-\u{1F3FF}]/gu, "").trim();
    return flagToCountryMap[baseFlag] || null;
}
