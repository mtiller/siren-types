import { Entity, SubEntity, EmbeddedRepresentationSubEntity } from "./types";
import { isEmbeddedLink, isEmbeddedRepr } from "./validate";

/**
 * Check with a given entity contains a particular class.
 * @param e
 * @param className
 * @param additionalClasses
 */
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
export function collectSelves(
  e: Entity<any> | EmbeddedRepresentationSubEntity<any>
): string[] {
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
      const entity: SubEntity<any> = e.entities[i];
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
