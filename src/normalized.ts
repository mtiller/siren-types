import {
  Entity,
  Link,
  Action,
  EmbeddedLinkSubEntity,
  Properties,
  EmbeddedRepresentationSubEntity,
  EmbeddedRepresentationSubEntityWithProperties,
  EmbeddedRepresentationSubEntityWithoutProperties,
  SubEntity,
} from "./types";
import { isEmbeddedLink } from "./functions";

/**
 * A slight variation on the Siren type where everything is now required.  Title
 * is a special case because I didn't want to use `""` as the default value so I
 * allow null in that case.  For everything else, empty objects and arrays suffice.
 */
export interface NormalizedEntity<
  P extends Properties | undefined = undefined
> {
  class: string[];
  title: string | null;
  properties: P;
  entities: NormalizedSubEntity[];
  actions: NormalizedAction[];
  links: Link[];
}

/**
 * This function normalizes an existing Siren Entity.
 *
 * Note this doesn't normalize properties because we cannot know how to
 * normalize them.  So we just hope they are what we expect.
 */
export function normalize<P extends Properties | undefined = undefined>(
  e: Entity<P>,
  defaultProps: P
): NormalizedEntity<P> {
  let props: P = e.properties === undefined ? undefined : defaultProps;
  if (props) {
    return {
      class: e.class || [],
      title: e.title || null,
      properties: props,
      entities: e.entities
        ? e.entities.map((x) => normalizeEmbedded(x as SubEntity))
        : [],
      actions: e.actions ? e.actions.map((x) => normalizeAction(x)) : [],
      links: e.links || [],
    };
  } else {
    return {
      class: e.class || [],
      title: e.title || null,
      entities: e.entities
        ? e.entities.map((x) => normalizeEmbedded(x as SubEntity))
        : [],
      actions: e.actions ? e.actions.map((x) => normalizeAction(x)) : [],
      links: e.links || [],
    } as NormalizedEntity<P>;
  }
}

export function normalizeEmbeddedLinkSubEntity(
  e: EmbeddedLinkSubEntity
): NormalizedEmbeddedLinkSubEntity {
  return {
    class: e.class || [],
    rel: e.rel,
    href: e.href,
    type: e.type || "application/octet-stream",
    title: e.title || null,
  };
}

export function normalizeEmbeddedRepresentationSubEntity<
  P extends Properties | undefined
>(
  e: EmbeddedRepresentationSubEntity<P>
): NormalizedEmbeddedRepresentationSubEntity<P> {
  return {
    class: e.class || [],
    rel: e.rel,
    title: e.title || null,
    properties: e.properties as P,
    entities: e.entities
      ? e.entities.map((x) => normalizeEmbedded(x as SubEntity))
      : [],
    actions: e.actions ? e.actions.map((x) => normalizeAction(x)) : [],
    links: e.links || [],
  };
}

export function normalizeEmbedded<P extends Properties | undefined>(
  e: SubEntity<P>
): NormalizedSubEntity<P> {
  if (isEmbeddedLink(e)) {
    return normalizeEmbeddedLinkSubEntity(e);
  }
  return normalizeEmbeddedRepresentationSubEntity(e);
}

/**
 * Normalized forms of the subentity types
 */
export type NormalizedSubEntity<P extends Properties | undefined = undefined> =
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
export interface NormalizedEmbeddedRepresentationSubEntity<P>
  extends NormalizedEntity<P> {
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
