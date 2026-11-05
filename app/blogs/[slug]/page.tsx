import { notFound } from "next/navigation";
import GuideBody from "@/components/blogs/guide/GuideBody";
import GuideCounselling from "@/components/blogs/guide/GuideCounselling";
import GuideFrame from "@/components/blogs/guide/GuideFrame";
import "@/components/blogs/guide/guide.css";
import { getGuide, guideSlugs } from "@/lib/guides";

export function generateStaticParams() {
  return guideSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: {
      canonical: `https://llmaxis.in/blogs/${slug}`,
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <GuideFrame
      title={guide.title}
      description={guide.metaDescription}
      toc={guide.toc}
      body={<GuideBody key="guide-body" blocks={guide.blocks} />}
      aside={
        <GuideCounselling
          key="guide-aside"
          contentTitle={guide.title}
          contentKind={guide.kind}
          contentSlug={guide.slug}
        />
      }
    />
  );
}
