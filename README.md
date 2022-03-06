# @svetlokit/cookie-manager

Library for simple management cookies in your SvelteKit app  

- [@svetlokit/cookie-manager](#svetlokitcookie-manager)
  - [Getting Started](#getting-started)
    - [1. Types](#1-types)
    - [2. Hooks](#2-hooks)
    - [3. Create adapter](#3-create-adapter)
    - [4. Use adapters](#4-use-adapters)
    - [5. Use in browser](#5-use-in-browser)
  - [Entities](#entities)
    - [`CookieManager<Options>`](#cookiemanageroptions)
      - [Members](#members)
    - [`CookieAdapter<T>`](#cookieadaptert)
      - [`public static serialize<T>(value: T): string`](#public-static-serializetvalue-t-string)
      - [`public static parse<T>(serializedValue: string): T`](#public-static-parsetserializedvalue-string-t)
      - [Members](#members-1)

## Getting Started
### 1. Types

Add to your [App.d.ts](https://kit.svelte.dev/docs/types#app) `cookieManager` fields - [`ServerCookieManager`](src/lib/managers/server-cookie-manager.ts) for server side and [`BrowserCookieManager`](src/lib/managers/browser-cookie-manager.ts) for browser

```
declare namespace App {
	 interface Locals {
		userid: string;
		cookieManager: import('@svetlokit/cookie-manager').ServerCookieManager;
	}

	interface Platform {}

	interface Session {}

	interface Stuff {
		cookieManager: import('@svetlokit/cookie-manager').BrowserCookieManager;
	}
}
```

### 2. Hooks
Add [`cookieManagerHook`](src/lib/hooks/cookie-manager.hook.ts)

```
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { cookieManagerHook } from  '@svetlokit/cookie-manager';

export const handle: Handle = sequence(cookieManagerHook, ...);
```
### 3. Create adapter

Create adapter for your cookie. You can do it by extending [`CookieAdapter'](src/lib/adapters/cookie-adapter.ts)


```
import { CookieAdapter } from  '@svetlokit/cookie-manager';

export class DateAdapter extends CookieAdapter<Date> {
    public static serialize(value: Date): string {
        return value.toISOString();
    }
    public static parse(serializedValue: string): Date {
        return new Date(serializedValue);
    }

    public get isFuture(): boolean {
        return this.value?.getTime() > Date.now();
    }
}
```

### 4. Use adapters

```
import { CookieManager, CookieTextAdapter } from '@svetlokit/cookie-manager';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { DateAdapter } from './date.adapter.ts';

export const get: RequestHandler = async (event: RequestEvent) => {
    const userAuthorizedAt: DateAdapter = event.locals.cookieManager.getAdapter(DateAdapter, 'date-authorize');
    ...
    userAuthorizedAt.update(new Date());
    ...
    ...
    ...
    const userRegisteredAt: DateAdapter = event.locals.cookieManager.getAdapter(DateAdapter, 'date-register');
    ...
};
```

### 5. Use in browser
Add to [__layout.svelte]() 

```
<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { BrowserCookieManager } from '@svetlokit/cookie-manager';

	// see https://kit.svelte.dev/docs#loading
	export const load: Load = async ({ fetch }) => {
		return { 
			stuff: {
				cookieManager: new BrowserCookieManager()
			}
		}
	};
</script>
```

And in ither files you can get manager from `page` store

```
<script lang="ts">
	import { page } from '$app/stores';

	import { onMount } from 'svelte';

	onMount(() =>{
		console.log($page.stuff.cookieManager);
	})
</script>
```


## Entities

### [`CookieManager<Options>`](src/lib/hooks/cookie-manager.hook.ts)
Mediator between cookies and adapters.

#### Members

| Fields                       | Descripton     |
|------------------------------|----------------|
| public get(name: string): string | undefined | Get cookie by name |

<br> 
 
| Methods                       | Descripton     |
|------------------------------|----------------|
| protected cookies: Map<string, string> | Initial cookies values |
| public set(name: string, value: string, options?: Options): void | Set cookie value |
| public remove(name: string): void | Remove cookie |;
| public getAdapter<...>(ctor: CookieAdapterCtor<T>, name: string, defaultValue?: any): T | Get adapter instance |;

### [`CookieAdapter<T>`](src/lib/adapters/cookie-adapter.ts)
Adapter for cookie, that keep value of some type (default - string).
You can create it with `CookieManager#getAdapter`, or by `new ...`  (in this case don't forget `CookieAdapter#setManager`. By defalut implementented `CookieJSONAdapter<D>` and `CookieTextAdapter`.  
Example of implementing adapter:

```
interface ParsedUserInfo {
    name: string;
    endOfTrial: string;
}

export interface UserInfo {
    name: string;
    endOfTrial: Date;
}

export class UserInfo extends CookieAdapter<Date> {
    public static serialize(value: UserInfo): string {
        return JSON.stringify(value);
    }
    public static parse(serializedValue: string): UserInfo {
        try {
            const info = JSON.parse(serializedValue);
            if (typeof info === 'object') {
                return {
                    ...info,
                    endOfTrial: new Date(info.endOfTrial)
                };
            }
        } catch (e) { }

        return null;
    }

    public get trialEnded(): boolean {
        return this.value?.endOfTrial?.getTime() > Date.now();
    }

    public extendTrial(): void {
        if (this.value) {
            const endOfTrial: Date = new Date(this.value.endOfTrial);
            endOfTrial.setDate(endOfTrial.getDate() + 1);
            
            this.update({ ...this.value, endOfTrial });
        }
    }
}

```

#### `public static serialize<T>(value: T): string`
Function for serialization value of adapter to cookie string value

```
...
public static serialize(value: Date): string {
    return value.toISOString();
}
...
```

#### `public static parse<T>(serializedValue: string): T`
Function for pasring adapter value from cookie value

```
...
public static parse(serializedValue: string): Date {
    return new Date(serializedValue);
}
...
```

#### Members

| Fields                       | Descripton     |
|------------------------------|----------------|
| public readonly name: string | Name of cookie |
| public initialValue?: string | Initial cookie value on adapter create moment |
| public get serializedValue(): string | Serialized current adapter value |
| protected value: D = null | Current adapter value |
| protected manager?: CookieManager | Manager, that gives initial value and saves updated value of this adapter |

<br> 
  
| Methods                       | Descripton     |
|------------------------------|----------------|
| public setManager(manager: CookieManager): void | Set manager |
| public update(value: D, options?: CookieOptions): void | Update value |
