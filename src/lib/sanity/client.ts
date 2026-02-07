import { createClient } from "next-sanity";

export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
export const sanityApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-02-01";

export const isSanityConfigured = Boolean(sanityProjectId && sanityDataset);

export const sanityClient = createClient({
  projectId: sanityProjectId ?? "demo",
  dataset: sanityDataset ?? "production",
  apiVersion: sanityApiVersion,
  useCdn: true,
  perspective: "published",
  stega: false,
});
