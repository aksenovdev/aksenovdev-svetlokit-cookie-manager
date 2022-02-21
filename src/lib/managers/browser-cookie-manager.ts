import type { CookieAttributes } from "js-cookie"
import jsCookie from "js-cookie"
import { CookieManager } from './cookie-manager';

export class BrowserCookieManager extends CookieManager<CookieAttributes> {
    constructor() {
        super(jsCookie.get());
    }

    public get(name: string): string {
        return jsCookie.get(name);
    }

    public set(name: string, value: string, options?: CookieAttributes): void {
        jsCookie.set(name, value, options);
        super.set(name, value, options);
    }

    public remove(name: string): void {
        jsCookie.remove(name);
        super.remove(name);
    }
}
