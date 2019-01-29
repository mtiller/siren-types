import { SirenResponse } from "../src";

describe("Building Siren responses", () => {
  it("should be empty", () => {
    let resp = new SirenResponse(undefined).asJSON();
    expect(resp).toEqual({});
  });
  it("should have properties", () => {
    let resp = new SirenResponse({ x: 5 }).addProperty("x", 7).asJSON();
    expect(resp).toEqual({ properties: { x: 7 } });
  });
  it("should have link", () => {
    let resp = new SirenResponse(undefined)
      .link(["home"], "http://example.com", { title: "Sample Link" })
      .asJSON();
    expect(resp).toEqual({
      links: [
        { rel: ["home"], href: "http://example.com", title: "Sample Link" }
      ]
    });
  });

  it("should have actions", () => {
    let resp = new SirenResponse(undefined)
      .action("simulate", "http://example.com/{modelName}", {
        type: "rfc6570",
        title: "Simulate model"
      })
      .asJSON();
    expect(resp).toEqual({
      actions: [
        {
          name: "simulate",
          href: "http://example.com/{modelName}",
          type: "rfc6570",
          title: "Simulate model"
        }
      ]
    });
  });
});
