import { Siren, normalize, Action, normalizeAction } from "../src";

describe("Test normalizing functions", () => {
    it("should normalize an emtpy Entity", () => {
        const base: Siren = {};
        const normal = normalize(base, {});
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
            class: ["empty"],
        };
        const normal = normalize(base, {});
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
});
