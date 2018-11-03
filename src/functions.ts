import { Entity, SubEntity, EmbeddedLinkSubEntity, EmbeddedRepresentationSubEntity } from "./types";

/** Shorthand function */
export function isA(e: Entity<any>, className: string, ...additionalClasses: string[]): boolean {
    const names = [className, ...additionalClasses];
    return names.some(name => e.class.indexOf(name) >= 0);
}

/**
 * If you use this function in a conditional statement, the TypeScript compiler
 * will know to narrow the type of the argument based on the result.
 */
export function isEmbeddedLink(s: SubEntity): s is EmbeddedLinkSubEntity {
    return s.hasOwnProperty("href");
}

/**
 * If you use this function in a conditional statement, the TypeScript compiler
 * will know to narrow the type of the argument based on the result.
 */
export function isEmbeddedRepr<P>(s: SubEntity<P>): s is EmbeddedRepresentationSubEntity<P> {
    return !s.hasOwnProperty("href");
}
