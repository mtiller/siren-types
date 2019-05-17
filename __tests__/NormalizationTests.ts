import { Siren, normalize, Action, normalizeAction } from "../src";

describe("Test normalizing functions", () => {
    it("should normalize an emtpy Entity", () => {
        const base: Siren = {
            properties: {},
        };
        const normal = normalize(base);
        expect(normal).toEqual({
            class: [],
            title: null,
            properties: {},
            actions: [],
            links: [],
            entities: [],
        });
    });

    it("should normalize an Entity with a class", () => {
        const base: Siren = {
            properties: {},
            class: ["empty"],
        };
        const normal = normalize(base);
        expect(normal).toEqual({
            class: ["empty"],
            title: null,
            properties: {},
            actions: [],
            links: [],
            entities: [],
        });
    });

    it("should normalize an Action", () => {
        const base: Action = {
            name: "create",
            href: "/#",
        };
        const normal = normalizeAction(base);
        expect(normal).toEqual({
            name: base.name,
            class: [],
            method: "GET",
            href: base.href,
            title: base.name,
            type: "application/x-www-form-urlencoded",
            fields: [],
        });
    });

    it("should normalize subentities", () => {
        const base: Siren = {
            properties: undefined,
            entities: [
                {
                    properties: undefined,
                    class: ["items", "collection"],
                    rel: ["http://x.io/rels/order-items"],
                    href: "http://api.x.io/orders/42/items",
                },
                {
                    class: ["info", "customer"],
                    rel: ["http://x.io/rels/customer"],
                    properties: {
                        customerId: "pj123",
                        name: "Peter Joseph",
                    },
                    links: [{ rel: ["self"], href: "http://api.x.io/customers/pj123" }],
                },
                {
                    rel: ["http://x.io/rels/customer"],
                    properties: {
                        customerId: "pj124",
                        name: "Peter Joseph",
                    },
                    links: [{ rel: ["self"], href: "http://api.x.io/customers/pj124" }],
                },
                {
                    properties: undefined,
                    class: ["items", "collection"],
                    rel: ["http://x.io/rels/order-items"],
                    entities: [
                        {
                            rel: ["http://x.io/rels/order-items"],
                            href: "http://api.x.io/orders/42/items",
                        },
                        {
                            rel: ["http://x.io/rels/order-items"],
                            href: "http://api.x.io/orders/y/items",
                        },
                    ],
                    actions: [{ name: "create", title: "Create Item", href: "http://api.x.io/orders/42/items" }],
                },
            ],
            actions: [{ name: "create", title: "Create Item", href: "http://api.x.io/orders/42/items" }],
        };
        const normal = normalize(base);
        expect(normal).toMatchSnapshot();
    });
});
