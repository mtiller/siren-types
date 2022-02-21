import { Siren, isA, EntityWithoutProperties } from "../src";

const siren: EntityWithoutProperties = {
  class: ["foo", "bar"],
};

describe("Test predicates", () => {
  it("should find a single class", () => {
    expect(isA(siren, "foo")).toEqual(true);
    expect(isA(siren, "bar")).toEqual(true);
    expect(isA(siren, "bar", "not")).toEqual(true);
    expect(isA(siren, "not")).toEqual(false);
  });
});
