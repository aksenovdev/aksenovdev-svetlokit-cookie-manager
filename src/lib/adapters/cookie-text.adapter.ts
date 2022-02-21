import { CookieAdapter } from './cookie-adapter';

export class CookieTextAdapter extends CookieAdapter<string> {
    public static serialize(value: string): string {
        return value;
    }
    public static parse(serializedValue: string): string {
        return serializedValue || '';
    }
}
