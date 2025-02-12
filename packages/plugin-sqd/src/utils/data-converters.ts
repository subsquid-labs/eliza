import { Parser, type Options } from "json2csv";
import * as parquet from "@dsnp/parquetjs";

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
                case "bigint":
                    fields[key] =
                        parquet.ParquetFieldBuilder.createStringField();
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
 * Converts JSON data to Parquet format using streaming for better performance with large datasets
 * @param jsonData Array of JSON objects to convert
 * @returns Promise that resolves with the Parquet data as Buffer
 */
export async function jsonToParquet(
    jsonData: Record<string, any>[]
): Promise<Buffer> {
    if (!jsonData.length) {
        return Buffer.from([]);
    }

    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        const schema = createParquetSchema(jsonData[0]);

        const transformer = new parquet.ParquetTransformer(schema, {
            rowGroupSize: 10000,
            useDataPageV2: true,
        });

        transformer.on("data", (chunk: Buffer) => chunks.push(chunk));
        transformer.on("end", () => resolve(Buffer.concat(chunks)));
        transformer.on("error", (err) =>
            reject(
                new Error(`Failed to convert JSON to Parquet: ${err.message}`)
            )
        );

        for (const row of jsonData) {
            const processedRow = Object.entries(row).reduce(
                (acc, [key, value]) => ({
                    ...acc,
                    [key]: typeof value === "bigint" ? value.toString() : value,
                }),
                {} as Record<string, any>
            );

            transformer.write(processedRow);
        }

        transformer.end();
    });
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
