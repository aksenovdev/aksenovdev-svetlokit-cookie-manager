import { serialize, CookieSerializeOptions, parse } from "cookie"
import { CookieManager } from './cookie-manager';

const addDays: (date: Date, days: number) => Date 
    = (date: Date, days: number) => {
        date = new Date(date.toISOString());
        date.setDate(date.getDate() + days);
        return date;
    };

let manager: ServerCookieManager;

export class ServerCookieManager extends CookieManager<CookieSerializeOptions> {
    private deletedCookies: Set<string> = new Set<string>();
    private updatedCookies: Map<string, CookieSerializeOptions> = new Map<string, CookieSerializeOptions>();
    
    constructor(cookieHeader: string = '') {
        super(parse(cookieHeader || ''));
    }

    public remove(name: string): void {
        this.updatedCookies.delete(name);
        this.deletedCookies.add(name);
        super.remove(name);
    }

    public set(name: string, value: string, options?: CookieSerializeOptions): void {
        this.updatedCookies.set(name, options);
        this.deletedCookies.delete(name);

        super.set(name, value, options);
    }

    /**
     * Get value for 'set-cookie' header
     *
     * @returns {*}  {{ 'set-cookie' }}
     * @memberof ServerCookieManager
     */
    public getCookieHeader(): string[] {
        const deletedCookies: string[] = Array.from(this.deletedCookies)
            .map((cookieName: string) => serialize(
                cookieName,
                "deleted",
                { expires: new Date(1), sameSite: "strict" }
            ));
        const updatedCookies: string[] = Array.from(this.updatedCookies)
            .map(
                ([cookieName, options]: [string, CookieSerializeOptions]) =>
                    [cookieName, this.cookies.get(cookieName), options]
            )
		    .map(([key, value, options]: [string, string, CookieSerializeOptions]) => serialize(
                key,
                value,
                { expires: addDays(new Date(), 1), path: '/', ...(options || {}) })
            );
        
        return [...deletedCookies, ...updatedCookies];
    }
}

export const getServerCookieManager: (cookieHeader?: string) => ServerCookieManager
    = (cookieHeader: string = '') => manager = manager || new ServerCookieManager(cookieHeader);
