import {
  EmbeddedLinkSubEntity,
  Properties,
  SubEntity,
  EmbeddedRepresentationSubEntity,
  Siren
} from "./types";

import { createIs, createAssertType } from "typescript-is";

/**
 * If you use this function in a conditional statement, the TypeScript compiler
 * will know to narrow the type of the argument based on the result.
 */
export function isEmbeddedLink<P extends Properties | undefined>(
  s: SubEntity<P>
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

export const isSiren = createIs<Siren>();
export const validateSiren = createAssertType<Siren>();
