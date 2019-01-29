import { Siren, Field } from "./types";

interface Builder<T> {
  asJSON(): Siren<T>;
}

export interface PartialLink {
  class?: string[];
  title?: string;
  type?: string;
}

export interface PartialAction {
  class?: string[];
  method?: "GET" | "PUT" | "POST" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
  title?: string;
  type?: string;
  fields?: Field[];
}

export class SirenResponse<T> implements Builder<T> {
  private resp: Siren<T>;
  constructor(def: T, prev?: Siren<T>) {
    if (def) {
      this.resp = {
        ...(prev || {}),
        properties: def
      } as Siren<T>;
    } else {
      this.resp = { ...(prev || {}) } as Siren<T>;
    }
  }
  addProperty<K extends keyof T>(key: K, val: T[K]): SirenResponse<T> {
    let props: T = this.resp.properties;
    if (props) {
      (props as any)[key] = val;
    }
    return new SirenResponse<T>(props, this.resp);
  }
  properties(props: T): SirenResponse<T> {
    return new SirenResponse<T>(props, this.resp);
  }
  link(rel: string[], href: string, rest?: PartialLink): SirenResponse<T> {
    const resp: Siren<T> = {
      ...this.resp,
      links: [
        ...(this.resp.links || []),
        {
          ...(rest || {}),
          rel: rel,
          href: href
        }
      ]
    };
    return new SirenResponse<T>(this.resp.properties, resp);
  }
  action(name: string, href: string, rest?: PartialAction): SirenResponse<T> {
    const resp: Siren<T> = {
      ...this.resp,
      actions: [
        ...(this.resp.actions || []),
        {
          ...(rest || {}),
          name: name,
          href: href
        }
      ]
    };
    return new SirenResponse<T>(this.resp.properties, resp);
  }
  asJSON(): Siren<T> {
    return this.resp;
  }
}
