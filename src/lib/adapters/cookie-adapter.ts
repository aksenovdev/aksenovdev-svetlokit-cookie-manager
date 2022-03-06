import type { CookieManager, CookieOptions } from '../managers/cookie-manager';

type Ctor = typeof CookieAdapter;
type CtorParams = ConstructorParameters<Ctor>;
export type CookieAdapterCtor<T extends CookieAdapter<any>> = new (...args: CtorParams) => T;
/**
 * Adapter between cookie value and some data structure
 *
 * @export
 * @class CookieAdapter
 * @template D
 */
export class CookieAdapter<D = string> {
    /**
     * Convert data with type `D` to cookie value
     *
     * @static
     * @param {unknown} value Data
     * @returns {*}  {string}
     * @memberof CookieAdapter
     */
    public static serialize(value: unknown): string {
        return typeof value === 'object'
            ? JSON.stringify(value)
            : value?.toString() || '';
    }
    /**
     * Convert cookie value to data with type `D`
     *
     * @static
     * @param {string} serializedValue Cookie value
     * @returns {*}  {*}
     * @memberof CookieAdapter
     */
    public static parse(serializedValue: string): any {
        try {
            const obj: any = JSON.parse(serializedValue);
            return obj;
        } catch (error) {
            return serializedValue as unknown as any;
        }
    }

    public readonly name: string;
    public initialValue?: string;
    public get serializedValue(): string {
        return (this.constructor as Ctor).serialize(this.value) || '';
    };
    public value: D = null;
    protected manager?: CookieManager;

    constructor(name: string, manager?: CookieManager) {
        this.name = name;
        if(manager) {
            this.setManager(manager);
        }
    }

    public setManager(manager: CookieManager): void {
        this.manager = manager;
        this.initialValue = this.manager?.get(this.name);
        this.value = this.initialValue
            ? (this.constructor as Ctor).parse(this.initialValue)
            : null;
    }

    public update(value: D, options?: CookieOptions): void {
        this.value = value;
        this.manager?.set(this.name, this.serializedValue, options);
    }
}
