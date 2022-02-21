import { CookieAdapter } from './cookie-adapter';

export class CookieJSONAdapter<D> extends CookieAdapter<D> {
    public static serialize(value: unknown): string {
        return JSON.stringify(value);
    }
    public static parse(serializedValue: string): unknown {
        return  serializedValue ? JSON.stringify(serializedValue) : null;
    }
}
