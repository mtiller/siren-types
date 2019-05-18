import { collectSelves, Siren } from "../src";

describe("Find self hrefs", () => {
    it("should find no self links", () => {
        const s: Siren = {
            properties: undefined,
        };
        const selves = collectSelves(s);
        expect(selves).toHaveLength(0);
    });

    it("should find two self links", () => {
        const s: Siren = {
            properties: undefined,
            links: [{ rel: ["me", "self"], href: "/foo" }],
            entities: [{ rel: ["myself", "self"], href: "/foo" }],
        };
        const selves = collectSelves(s);
        expect(selves).toHaveLength(2);
        expect(selves).toEqual(["/foo", "/foo"]);
    });

    it("should find embedded self", () => {
        const s: Siren = {
            properties: undefined,
            entities: [
                {
                    rel: ["self"],
                    properties: undefined,
                    links: [{ rel: ["self"], href: "/bar" }],
                },
            ],
        };

        const selves = collectSelves(s);
        expect(selves).toHaveLength(1);
        expect(selves).toEqual(["/bar"]);
    });
});
