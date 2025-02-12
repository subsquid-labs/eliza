import { HttpClient } from "@abernatskiy/http-client";
import { PortalClient } from "@abernatskiy/portal-client";
import { Readable } from "stream";

export abstract class BaseJellyfishService<FetchParams, FetchResponse> {
    private static readonly MIN_BYTES = 1 * 1024 * 1024;
    private static readonly RETRY_ATTEMPTS = 3;

    constructor(private portalUrl: string) {}

    public abstract fetchData(params: FetchParams): Promise<FetchResponse>;

    /**
     * Returns an instance of the SQD Portal Client
     */
    public get portalClient() {
        const portalClient = new PortalClient({
            url: this.portalUrl,
            http: new HttpClient({
                retryAttempts: BaseJellyfishService.RETRY_ATTEMPTS,
                async fetch(input, init) {
                    let res = await fetch(input, init);
                    if (res.body instanceof Readable) {
                        res = new Response(
                            Readable.toWeb(res.body) as ReadableStream,
                            res
                        );
                    }

                    return res;
                },
            }),
            minBytes: BaseJellyfishService.MIN_BYTES,
        });

        return portalClient;
    }
}
