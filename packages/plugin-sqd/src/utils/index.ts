import fs from "fs";
import path from "path";

export function saveJsonFile(jsonData: any, filename: string): string {
    const outputDir = path.join(process.cwd(), "output");
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const unixTimestamp = Math.floor(Date.now() / 1000);
    const filepath = path.join(outputDir, `${filename}-${unixTimestamp}.json`);
    const jsonString = JSON.stringify(jsonData, null, 2);

    fs.writeFileSync(filepath, jsonString);

    return filepath;
}
