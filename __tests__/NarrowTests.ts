import {
  isEmbeddedLink,
  isEmbeddedRepr,
  EmbeddedLinkSubEntity,
  SubEntity,
  EmbeddedRepresentationSubEntity
} from "../src";

describe("Test functions that narrow types", () => {
  it("should narrow and embedded link", () => {
    const link: EmbeddedLinkSubEntity = {
      rel: ["self"],
      href: "/#",
      title: "An embedded link sub entity"
    };
    const entity: SubEntity = link;
    expect(isEmbeddedLink(entity)).toEqual(true);
    if (isEmbeddedLink(entity)) {
      const href = entity.href; // Will only compile if narrow works.
      expect(href).toEqual(link.href);
    }
  });
  it("should narrow and embedded link", () => {
    const link: EmbeddedRepresentationSubEntity = {
      rel: ["self"],
      title: "An embedded link sub entity"
    };
    const entity: SubEntity = link;
    expect(isEmbeddedRepr(entity)).toEqual(true);
  });
  it("should filter in a type safe way", () => {
    const link1: EmbeddedRepresentationSubEntity<{}> = {
      rel: ["self"],
      title: "An embedded link sub entity",
      properties: {
        a: 5
      }
    };
    const link2: EmbeddedLinkSubEntity = {
      rel: ["self"],
      href: "/#",
      title: "An embedded link sub entity"
    };
    const embeds = [link1, link2];
    const reprs: Array<EmbeddedRepresentationSubEntity<{}>> = embeds.filter(
      isEmbeddedRepr
    );
    const links: Array<EmbeddedLinkSubEntity> = embeds.filter(isEmbeddedLink);
    expect(links).toEqual([link2]);
    expect(reprs).toEqual([link1]);
  });
});
