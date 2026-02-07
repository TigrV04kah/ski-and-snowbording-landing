import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient, isSanityConfigured } from "@/lib/sanity/client";

const builder = createImageUrlBuilder(sanityClient);

export function imageUrl(source: unknown, width = 1200, height = 800): string {
  if (!source) {
    return "/placeholder.svg";
  }

  if (typeof source === "string") {
    return source;
  }

  if (!isSanityConfigured) {
    return "/placeholder.svg";
  }

  return builder.image(source).width(width).height(height).fit("crop").auto("format").url();
}
