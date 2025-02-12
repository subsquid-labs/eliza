import fs from "fs";
import path from "path";

export function saveJsonFile(jsonData: any, baseFileName: string): string {
    const outputDir = path.join(process.cwd(), "output");
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const unixTimestamp = Math.floor(Date.now() / 1000);
    const filepath = path.join(
        outputDir,
        `${baseFileName}-${unixTimestamp}.json`
    );
    const jsonString = JSON.stringify(jsonData, null, 2);

    fs.writeFileSync(filepath, jsonString);

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

