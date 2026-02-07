import { groq } from "next-sanity";

export const instructorsQuery = groq`
  *[_type == "instructor" && isPublished == true] | order(_updatedAt desc) {
    "id": _id,
    "slug": slug.current,
    name,
    "coverImage": photo,
    gallery,
    "discipline": select(
      defined(disciplines) => disciplines,
      defined(discipline) => [discipline],
      []
    ),
    level,
    format,
    languages,
    experienceYears,
    priceFrom,
    "shortDescription": coalesce(shortBio[$locale], shortBio.ru, shortBio.en),
    "fullDescription": coalesce(fullDescription[$locale], fullDescription.ru, fullDescription.en),
    "included": coalesce(included[$locale], included.ru, included.en),
    "notIncluded": coalesce(notIncluded[$locale], notIncluded.ru, notIncluded.en),
    "conditions": coalesce(conditions[$locale], conditions.ru, conditions.en),
    contacts,
    isFeatured,
    isPublished,
    "updatedAt": _updatedAt
  }
`;

export const instructorBySlugQuery = groq`
  *[_type == "instructor" && slug.current == $slug && isPublished == true][0] {
    "id": _id,
    "slug": slug.current,
    name,
    "coverImage": photo,
    gallery,
    "discipline": select(
      defined(disciplines) => disciplines,
      defined(discipline) => [discipline],
      []
    ),
    level,
    format,
    languages,
    experienceYears,
    priceFrom,
    "shortDescription": coalesce(shortBio[$locale], shortBio.ru, shortBio.en),
    "fullDescription": coalesce(fullDescription[$locale], fullDescription.ru, fullDescription.en),
    "included": coalesce(included[$locale], included.ru, included.en),
    "notIncluded": coalesce(notIncluded[$locale], notIncluded.ru, notIncluded.en),
    "conditions": coalesce(conditions[$locale], conditions.ru, conditions.en),
    contacts,
    isFeatured,
    isPublished,
    "updatedAt": _updatedAt
  }
`;

export const servicesQuery = groq`
  *[_type == "service" && isPublished == true] | order(_updatedAt desc) {
    "id": _id,
    "slug": slug.current,
    name,
    "coverImage": cover,
    gallery,
    serviceType,
    duration,
    season,
    priceFrom,
    "shortDescription": coalesce(description[$locale], description.ru, description.en),
    "fullDescription": coalesce(description[$locale], description.ru, description.en),
    "included": coalesce(included[$locale], included.ru, included.en),
    "conditions": coalesce(conditions[$locale], conditions.ru, conditions.en),
    contacts,
    isFeatured,
    isPublished,
    "updatedAt": _updatedAt
  }
`;

export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug && isPublished == true][0] {
    "id": _id,
    "slug": slug.current,
    name,
    "coverImage": cover,
    gallery,
    serviceType,
    duration,
    season,
    priceFrom,
    "shortDescription": coalesce(description[$locale], description.ru, description.en),
    "fullDescription": coalesce(description[$locale], description.ru, description.en),
    "included": coalesce(included[$locale], included.ru, included.en),
    "conditions": coalesce(conditions[$locale], conditions.ru, conditions.en),
    contacts,
    isFeatured,
    isPublished,
    "updatedAt": _updatedAt
  }
`;

export const articlesQuery = groq`
  *[_type == "article" && isPublished == true] | order(publishedAt desc) {
    "id": _id,
    "slug": slug.current,
    "title": coalesce(title[$locale], title.ru, title.en),
    "excerpt": coalesce(excerpt[$locale], excerpt.ru, excerpt.en),
    "content": coalesce(contentRich[$locale], content[$locale], contentRich.ru, content.ru, contentRich.en, content.en),
    "coverImage": cover,
    category,
    "seoTitle": coalesce(seoTitle[$locale], seoTitle.ru, seoTitle.en),
    "seoDescription": coalesce(seoDescription[$locale], seoDescription.ru, seoDescription.en),
    publishedAt,
    "updatedAt": _updatedAt,
    isPublished
  }
`;

export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug && isPublished == true][0] {
    "id": _id,
    "slug": slug.current,
    "title": coalesce(title[$locale], title.ru, title.en),
    "excerpt": coalesce(excerpt[$locale], excerpt.ru, excerpt.en),
    "content": coalesce(contentRich[$locale], content[$locale], contentRich.ru, content.ru, contentRich.en, content.en),
    "coverImage": cover,
    category,
    "seoTitle": coalesce(seoTitle[$locale], seoTitle.ru, seoTitle.en),
    "seoDescription": coalesce(seoDescription[$locale], seoDescription.ru, seoDescription.en),
    publishedAt,
    "updatedAt": _updatedAt,
    isPublished
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    "siteName": coalesce(siteName[$locale], siteName.ru, siteName.en),
    "tagline": coalesce(tagline[$locale], tagline.ru, tagline.en),
    "description": coalesce(description[$locale], description.ru, description.en),
    partnerCtaEmail,
    contactPhone,
    contactTelegram,
    contactWhatsapp,
    "seoTitleDefault": coalesce(seoTitleDefault[$locale], seoTitleDefault.ru, seoTitleDefault.en),
    "seoDescriptionDefault": coalesce(seoDescriptionDefault[$locale], seoDescriptionDefault.ru, seoDescriptionDefault.en),
    socialLinks
  }
`;

export const reviewsByInstructorSlugQuery = groq`
  *[
    _type == "review" &&
    isPublished == true &&
    defined(instructor->slug.current) &&
    instructor->slug.current == $slug
  ] | order(date desc) {
    "id": _id,
    "instructorSlug": instructor->slug.current,
    author,
    rating,
    "text": coalesce(text[$locale], text.ru, text.en),
    date,
    verified
  }
`;
