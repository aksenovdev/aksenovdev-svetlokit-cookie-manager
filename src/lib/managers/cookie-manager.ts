import type { CookieAdapter, CookieAdapterCtor } from '../adapters/cookie-adapter';

export interface CookieOptions {
    /**
     * Define when the cookie will be removed. Value can be a Number
     * which will be interpreted as days from time of creation or a
     * Date instance. If omitted, the cookie becomes a session cookie.
     */
    expires?: number | Date | undefined;

    /**
     * Define the path where the cookie is available. Defaults to '/'
     */
    path?: string | undefined;

    /**
     * Define the domain where the cookie is available. Defaults to
     * the domain of the page where the cookie was created.
     */
    domain?: string | undefined;

    /**
     * A Boolean indicating if the cookie transmission requires a
     * secure protocol (https). Defaults to false.
     */
    secure?: boolean | undefined;

    /**
     * Asserts that a cookie must not be sent with cross-origin requests,
     * providing some protection against cross-site request forgery
     * attacks (CSRF)
     */
    sameSite?: 'strict' | 'Strict' | 'lax' | 'Lax' | 'none' | 'None' | undefined;

    /**
     * Specifies the boolean value for the {@link https://tools.ietf.org/html/rfc6265#section-5.2.6|`HttpOnly` `Set-Cookie` attribute}.
     * When truthy, the `HttpOnly` attribute is set, otherwise it is not. By
     * default, the `HttpOnly` attribute is not set.
     *
     * *Note* be careful when setting this to true, as compliant clients will
     * not allow client-side JavaScript to see the cookie in `document.cookie`.
     */
     httpOnly?: boolean | undefined;

    /**
     * An attribute which will be serialized, conformably to RFC 6265
     * section 5.2.
     */
    [property: string]: any;
}

export class CookieManager<Options = CookieOptions> {
    private static adapters: Map<string, CookieAdapter> = new Map();

    protected cookies: Map<string, string> = new Map();

    constructor(cookies: Record<string, string> = {}) {
        this.cookies = new Map(Object.entries(cookies));
    }

    public get(name: string): string | undefined {
        return this.cookies.get(name);
    };

    public set(name: string, value: string, options?: Options): void {
        this.cookies.set(name, value);
    };

    public remove(name: string): void {
        this.cookies.delete(name);
    };

    public getAdapter<T extends CookieAdapter<any>>(ctor: CookieAdapterCtor<T>, name: string, defaultValue?: any): T {
        const key: string = `${name}:${ctor.name}`;
        const adapter: CookieAdapter = CookieManager.adapters.get(key)
            || CookieManager.adapters.set(key, new ctor(name, this)).get(key);
        if (defaultValue !== null && defaultValue !== undefined && !this.cookies.has(adapter.name)) {
            adapter.update(defaultValue);
        }

        return adapter as T;
    }
}
