import { IAgentRuntime } from "@elizaos/core";
import fs from "fs";
import path from "path";
import { jsonToCsv, jsonToParquet } from "./data-converters";

export function saveFile(
    content: string | Buffer,
    baseFileName: string,
    fileFormat: "json" | "csv" | "parquet"
): string {
    const outputDir = path.join(process.cwd(), "output");
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const unixTimestamp = Math.floor(Date.now() / 1000);
    const filepath = path.join(
        outputDir,
        `${baseFileName}-${unixTimestamp}.${fileFormat}`
    );

    fs.writeFileSync(filepath, content);

    return filepath;
}

export function getConfigParams(runtime: IAgentRuntime): {
    portalUrl: string;
    rpcUrl: string;
} {
    const portalUrl = runtime.getSetting("SQD_PORTAL_URL");
    if (!portalUrl) {
        throw new Error("SQD_PORTAL_URL is not set");
    }

    const rpcUrl = runtime.getSetting("SQD_RPC_URL");
    if (!rpcUrl) {
        throw new Error("SQD_RPC_URL is not set");
    }

    return { portalUrl, rpcUrl };
}

export async function handleFileOutput(
    jsonData: any,
    baseFileName: string,
    fileFormat: "json" | "csv" | "parquet"
) {
    const jsonString = JSON.stringify(jsonData, null, 2);
    let fileContent: string | Buffer;

    if (fileFormat === "json") {
        fileContent = jsonString;
    } else if (fileFormat === "csv") {
        fileContent = jsonToCsv(jsonData);
    } else if (fileFormat === "parquet") {
        fileContent = await jsonToParquet(jsonData);
    }

    return saveFile(fileContent, baseFileName, fileFormat);
}
