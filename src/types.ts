/**
 * These types are based on the JSON Schema found at:
 *
 * https://gist.github.com/kevinswiber/14477759858a768d2809326ca4300d26
 */

// This is a alias for a Siren entity where the type of the properties has a default
export type Siren<P extends {} = any> = Entity<P>;

// Shorthand for the mouthful that is EmbeddedRepresentationSubEntity.
export type EmbeddedEntity<P> = EmbeddedRepresentationSubEntity<P>;

// This is another short-hand
export type EmbeddedLink = EmbeddedLinkSubEntity;

export type Properties = {} | undefined;

/**
 * This is the definition of a Siren entity.  Note that everything is optional
 */
export interface Entity<P extends Properties = {}> {
    // class: Describes the nature of an entity's content based on the current representation.
    // Possible values are implementation-dependent and should be documented.
    class?: string[];
    // title - Descriptive text about the entity.
    title?: string;
    // A set of key-value pairs that describe the state of an entity.
    properties: P;
    // entities - A collection of related sub-entities. If a sub-entity contains an href value,
    // it should be treated as an embedded link. Clients may choose to optimistically load embedded
    // links. If no href value exists, the sub-entity is an embedded entity representation that
    // contains all the characteristics of a typical entity. One difference is that a sub-entity
    // MUST contain a rel attribute to describe its relationship to the parent entity.
    entities?: SubEntity<any>[];
    // actions - A collection of actions; actions show available behaviors an entity exposes.
    actions?: Action[];
    // links - A collection of items that describe navigational links, distinct from entity
    // relationships. Link items should contain a `rel` attribute to describe the relationship
    // and an `href` attribute to point to the target URI. Entities should include a link `rel` to `self`.
    links?: Link[];
}

/**
 * Entities in Siren come in two flavors.  Personally, I've never used the
 * embedded link sub-entity, but I include it here for completeness.
 */
export type SubEntity<P extends {} = {}> = EmbeddedLinkSubEntity | EmbeddedRepresentationSubEntity<P>;

/**
 * The aforementioned (but never actually used by me) EmbeddedLinkSubEntity.
 */
export interface EmbeddedLinkSubEntity {
    // required - rel and href
    // class - Describes the nature of an entity's content based on the current
    // representation. Possible values are implementation-dependent and should be documented.
    class?: string[];
    // rel - Defines the relationship of the sub-entity to its parent, per Web Linking (RFC5899).
    // required and cannot be empty.
    rel: string[];
    // href - The URI of the linked sub-entity.
    href: string;
    // type - Defines media type of the linked sub-entity, per Web Linking (RFC5899).
    type?: string;
    // title - Descriptive text about the entity.
    title?: string;
}

/**
 * An embedded sub-entity.  It is just like any other Siren representation
 * except that it MUST include a relation as well.
 */
export interface EmbeddedRepresentationSubEntity<P> extends Entity<P> {
    // rel - Defines the relationship of the sub-entity to its parent, per Web Linking (RFC5899).
    // required and cannot be empty.
    rel: string[];
}

/**
 * Actions show available behaviors an entity exposes.
 */
export interface Action {
    // name - A string that identifies the action to be performed.
    // Action names MUST be unique within the set of actions for an entity.
    // The behaviour of clients when parsing a Siren document that violates
    // this constraint is undefined.
    name: string;
    // class - Describes the nature of an action based on
    // the current representation. Possible values are
    // implementation-dependent and should be documented.
    class?: string[];
    // method - An enumerated attribute mapping to a protocol method. For HTTP,
    // these values may be GET, PUT, POST, DELETE, or PATCH. As new methods are
    // introduced, this list can be extended. If this attribute is omitted, GET
    // should be assumed.  (default: "GET")
    method?: "GET" | "PUT" | "POST" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
    // href - The URI of the action.
    href: string;
    // title - Descriptive text about the action.
    title?: string;
    // type - The encoding type for the request. When omitted and the fields
    // attribute exists, the default value is `application/x-www-form-urlencoded`.
    type?: string;
    // fields - A collection of fields.
    fields?: Field[];
}

export interface Field {
    // name - A name describing the control. Field names MUST be unique within the
    // set of fields for an action. The behaviour of clients when parsing a Siren
    // document that violates this constraint is undefined.
    name: string;
    // type - The input type of the field. This is a subset of the input types specified by HTML5.
    type?:
        | "hidden"
        | "text"
        | "search"
        | "tel"
        | "url"
        | "email"
        | "password"
        | "datetime"
        | "date"
        | "month"
        | "week"
        | "time"
        | "datetime-local"
        | "number"
        | "range"
        | "color"
        | "checkbox"
        | "radio"
        | "file";
    // title - Textual annotation of a field. Clients may use this as a label.
    title?: string;
    // value - A value assigned to the field.  May be a scalar value or a list of value objects.
    value?: string | number | FieldValueObject[];
}

/**
 * Value objects represent multiple selectable field values. Use
 * in conjunction with field `"type" = "radio"` and `"type" = "checkbox"`
 * to express that zero, one or many out of several possible values may be sent back to the server.
 */
export interface FieldValueObject {
    // value - Possible value for the field.
    value: string | number;
    // title - Textual description of a field value.
    title?: string;
    // selected - A value object with a `"selected" = true` attribute
    // indicates that this value should be considered preselected by
    // the client. When missing, the default value is `false`.
    selected?: boolean;
}

/**
 * Links represent navigational transitions.
 */
export interface Link {
    // class - Describes aspects of the link based on the current representation.
    // Possible values are implementation-dependent and should be documented.
    class?: string[];
    // title - Text describing the nature of a link.
    title?: string;
    // rel - Defines the relationship of the link to its entity, per Web Linking (RFC5988).
    rel: string[];
    // href - The URI of the linked resource.
    href: string;
    // type - Defines media type of the linked resource, per Web Linking (RFC5988).
    type?: string;
}
