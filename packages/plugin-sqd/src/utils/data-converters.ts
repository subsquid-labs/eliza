import { Parser, type Options } from "json2csv";
import * as parquet from "@dsnp/parquetjs";
import { tmpdir } from "os";
import { join } from "path";
import { readFileSync, unlinkSync } from "fs";

/**
 * Creates a Parquet schema from a sample object
 * @param sampleObj Sample object to infer schema from
 * @returns ParquetSchema
 */
function createParquetSchema(
    sampleObj: Record<string, any>
): parquet.ParquetSchema {
    const schemaFields = Object.entries(sampleObj).reduce(
        (fields, [key, value]) => {
            switch (typeof value) {
                case "string":
                    fields[key] =
                        parquet.ParquetFieldBuilder.createStringField();
                    break;
                case "number":
                    fields[key] =
                        parquet.ParquetFieldBuilder.createDoubleField();
                    break;
                case "boolean":
                    fields[key] =
                        parquet.ParquetFieldBuilder.createBooleanField();
                    break;
                default:
                    fields[key] =
                        parquet.ParquetFieldBuilder.createStringField();
            }
            fields[key].optional = true;
            return fields;
        },
        {} as Record<string, any>
    );

    return new parquet.ParquetSchema(schemaFields);
}

/**
 * Converts JSON data to Parquet format
 * @param jsonData Array of JSON objects to convert
 * @returns Promise that resolves with the Parquet data as Buffer
 */
export async function jsonToParquet(
    jsonData: Record<string, any>[]
): Promise<Buffer> {
    if (!jsonData.length) {
        return Buffer.from([]);
    }

    const tmpFile = join(tmpdir(), `tmp-${Date.now()}.parquet`);

    try {
        const schema = createParquetSchema(jsonData[0]);
        const writer = await parquet.ParquetWriter.openFile(schema, tmpFile);

        writer.setRowGroupSize(8192);
        await Promise.all(jsonData.map((row) => writer.appendRow(row)));
        await writer.close();

        const buffer = readFileSync(tmpFile);
        return buffer;
    } catch (error) {
        throw new Error(`Failed to convert JSON to Parquet: ${error.message}`);
    } finally {
        try {
            unlinkSync(tmpFile);
        } catch {
            // Ignore cleanup errors
        }
    }
}

/**
 * Converts JSON data to CSV format
 * @param jsonData Array of JSON objects to convert
 * @param options Optional Parser options for json2csv
 * @returns The CSV string
 */
export function jsonToCsv(
    jsonData: Record<string, any>[],
    options: Options<Record<string, any>> = { header: true, quote: "" }
): string {
    try {
        if (!jsonData.length) {
            return "";
        }

        const parser = new Parser(options);
        return parser.parse(jsonData);
    } catch (error) {
        throw new Error(`Failed to convert JSON to CSV: ${error.message}`);
    }
}
