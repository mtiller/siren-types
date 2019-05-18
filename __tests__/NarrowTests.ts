import { isEmbeddedLink, EmbeddedLinkSubEntity, SubEntity, EmbeddedEntity, isEmbeddedEntity } from "../src";

describe("Test functions that narrow types", () => {
    it("should narrow and embedded link", () => {
        const link: EmbeddedLinkSubEntity = {
            rel: ["self"],
            href: "/#",
            title: "An embedded link sub entity",
        };
        const entity: SubEntity = link;
        expect(isEmbeddedLink(entity)).toEqual(true);
        if (isEmbeddedLink(entity)) {
            const href = entity.href; // Will only compile if narrow works.
            expect(href).toEqual(link.href);
        }
    });
    it("should narrow and embedded link", () => {
        const link: EmbeddedEntity<{}> = {
            properties: undefined,
            rel: ["self"],
            title: "An embedded link sub entity",
        };
        const entity: SubEntity = link;
        expect(isEmbeddedEntity(entity)).toEqual(true);
    });
});
