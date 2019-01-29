import {
  Entity,
  SubEntity,
  Properties,
  EmbeddedLinkSubEntity,
  EmbeddedRepresentationSubEntity,
  EmbeddedRepresentationSubEntityWithoutProperties,
  EmbeddedRepresentationSubEntityWithProperties
} from "./types";

/** Shorthand function */
export function isA(
  e: Entity<any>,
  className: string,
  ...additionalClasses: string[]
): boolean {
  const names = [className, ...additionalClasses];
  return names.some(name => e.class.indexOf(name) >= 0);
}

/**
 * Fetch (all) self relations.  Only the href is included here because these
 * might come from a Link, EmbeddedLink or EmbeddedEntity (very unlikely).
 * @param s
 */
export function collectSelves(e: Entity<any>): string[] {
  let ret: string[] = [];
  if (e.links) {
    for (let i = 0; i < e.links.length; i++) {
      // istanbul ignore else
      if (e.links[i].rel.indexOf("self") >= 0) {
        ret.push(e.links[i].href);
      }
    }
  }
  if (e.entities) {
    for (let i = 0; i < e.entities.length; i++) {
      const entity = e.entities[i];
      if (isEmbeddedLink(entity)) {
        // istanbul ignore else
        if (entity.rel.indexOf("self") >= 0) {
          ret.push(entity.href);
        }
      } else {
        // From the spec:
        //
        // Root entities and sub-entities that are embedded representations
        // SHOULD contain a links collection with at least one item contain
        // a rel value of self and an href attribute with a value of the
        // entity's URI.
        // istanbul ignore else
        if (entity.rel.indexOf("self") >= 0) {
          ret = [...ret, ...collectSelves(entity)];
        }
      }
    }
  }
  return ret;
}

/**
 * If you use this function in a conditional statement, the TypeScript compiler
 * will know to narrow the type of the argument based on the result.
 */
export function isEmbeddedLink<P extends Properties | undefined>(
  s:
    | EmbeddedLinkSubEntity
    | EmbeddedRepresentationSubEntityWithoutProperties
    | EmbeddedRepresentationSubEntityWithProperties<P>
): s is EmbeddedLinkSubEntity {
  return s.hasOwnProperty("href");
}

/**
 * If you use this function in a conditional statement, the TypeScript compiler
 * will know to narrow the type of the argument based on the result.
 */
export function isEmbeddedRepr<P>(
  s: SubEntity<P>
): s is EmbeddedRepresentationSubEntity<P> {
  return !s.hasOwnProperty("href");
}
