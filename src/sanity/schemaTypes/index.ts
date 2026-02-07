import { articleType } from "@/sanity/schemaTypes/article";
import { contactLinksType, socialLinkType } from "@/sanity/schemaTypes/common";
import { instructorType } from "@/sanity/schemaTypes/instructor";
import { localizedPortableText, localizedString, localizedText } from "@/sanity/schemaTypes/localizedFields";
import { reviewType } from "@/sanity/schemaTypes/review";
import { serviceType } from "@/sanity/schemaTypes/service";
import { siteSettingsType } from "@/sanity/schemaTypes/siteSettings";

export const schemaTypes = [
  localizedString,
  localizedText,
  localizedPortableText,
  contactLinksType,
  socialLinkType,
  instructorType,
  serviceType,
  articleType,
  reviewType,
  siteSettingsType,
];
