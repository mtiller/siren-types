# Siren Types for TypeScript

The goal of this project is to create TypeScript types that properly map to the
[Siren](https://github.com/kevinswiber/siren) specification.  My goal is to
adhere to the [JSON Schema for
Siren](https://github.com/kevinswiber/siren/blob/master/siren.schema.json).

If you are interested in this, you might also be interested in my TypeScript
Siren API navigation package, [`siren-nav`](https://github.com/xogeny/siren-nav).

## Caveats

### Generics

I use generics in this library primarily to represent the type of proeprties.

### Property Types

From a typing standpoint, the `properties` field must be specified in literals
but the type of `properties` can be `undefined`.  I know it seems odd, but the
goal here is to force users to specify the type of `properties` (yes, even if
that type is `undefined`).

### Aliases

The JSON Schema for Siren gives names to various constructs.  I have included
TypeScript definitions for all of those.  However, some of the names are a bit
verbose (*e.g.,* `EmbeddedRepresentationSubEntity` vs. `EmbeddedLinkSubEntity`).  So
I've also established aliases for those (`EmbeddedEntity` and `LinkEntity`
respectively).  Given the naming in Siren, you might expect the shorthands to be
`EmbeddedRepresentation` and `EmbeddedLink`.  The point is that there are two types of `entities`
(unfortunately...).  I only use the `EmbeddedEntity` type of entity, but the
library supports both.