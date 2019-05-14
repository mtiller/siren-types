import {
    Entity,
    Link,
    Action,
    EmbeddedLinkSubEntity,
    EmbeddedRepresentationSubEntity,
    SubEntity,
    Properties,
} from "./types";
import { isEmbeddedLink } from "./functions";

/**
 * A slight variation on the Siren type where everything is now required.  Title
 * is a special case because I didn't want to use `""` as the default value so I
 * allow null in that case.  For everything else, empty objects and arrays suffice.
 */
export interface NormalizedEntity<P> {
    class: string[];
    title: string | null;
    properties: P;
    entities: NormalizedSubEntity[];
    actions: NormalizedAction[];
    links: Link[];
}

/**
 * This function normalizes an existing Siren Entity.
 */
export function normalize<P extends Properties>(e: Entity<P>, defaultProps: P): NormalizedEntity<P> {
    return {
        class: e.class || [],
        title: e.title || null,
        properties: e.properties || defaultProps,
        entities: e.entities ? e.entities.map(x => normalizeEmbedded(x, {})) : [],
        actions: e.actions ? e.actions.map(x => normalizeAction(x)) : [],
        links: e.links || [],
    };
}

export function normalizeEmbeddedLinkSubEntity(e: EmbeddedLinkSubEntity): NormalizedEmbeddedLinkSubEntity {
    return {
        class: e.class || [],
        rel: e.rel,
        href: e.href,
        type: e.type || "application/octet-stream",
        title: e.title || null,
    };
}

export function normalizeEmbeddedRepresentationSubEntity<P>(
    e: EmbeddedRepresentationSubEntity<P>,
    defaultProps: P,
): NormalizedEmbeddedRepresentationSubEntity<P> {
    return {
        class: e.class || [],
        rel: e.rel,
        title: e.title || null,
        properties: e.properties || defaultProps,
        entities: e.entities ? e.entities.map(x => normalizeEmbedded(x, {})) : [],
        actions: e.actions ? e.actions.map(x => normalizeAction(x)) : [],
        links: e.links || [],
    };
}

export function normalizeEmbedded<P>(e: SubEntity<P>, defaultProps: P): NormalizedSubEntity<{}> {
    if (isEmbeddedLink(e)) {
        return normalizeEmbeddedLinkSubEntity(e);
    }
    return normalizeEmbeddedRepresentationSubEntity(e, {});
}

/**
 * Normalized forms of the subentity types
 */
export type NormalizedSubEntity<P extends Properties = {}> =
    | NormalizedEmbeddedLinkSubEntity
    | NormalizedEmbeddedRepresentationSubEntity<P>;

export interface NormalizedEmbeddedLinkSubEntity {
    class: string[];
    rel: string[];
    href: string;
    type: string;
    title: string | null;
}

/**
 * Normalized version of an embedded representation
 */
export interface NormalizedEmbeddedRepresentationSubEntity<P> extends NormalizedEntity<P> {
    rel: string[];
}

export type NormalizedAction = Required<Action>;

export function normalizeAction(a: Action): NormalizedAction {
    return {
        name: a.name,
        class: a.class || [],
        method: a.method || "GET",
        href: a.href,
        title: a.title || a.name,
        type: a.type || "application/x-www-form-urlencoded",
        fields: a.fields || [],
    };
}
