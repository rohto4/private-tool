import { describe, expect, it } from "vitest";
import { createTitleSignature, normalizeUrl, stripHtml, truncateText } from "@/lib/feeds/normalize";

describe("feed normalization", () => {
  it("removes hash and utm params from URLs", () => {
    expect(normalizeUrl("https://example.com/a?utm_source=x&id=1#top")).toBe(
      "https://example.com/a?id=1"
    );
  });

  it("strips HTML and truncates text", () => {
    const text = stripHtml("<p>Hello <strong>world</strong></p>");
    expect(text).toBe("Hello world");
    expect(truncateText(text, 6)).toBe("Hello…");
  });

  it("creates equivalent title signatures for punctuation differences", () => {
    expect(createTitleSignature("AI News: Hello!")).toBe(createTitleSignature("AI News Hello"));
  });
});
