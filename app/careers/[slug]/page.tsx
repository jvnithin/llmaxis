import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CareerDetailView from "@/components/careers/CareerDetailView";
import {
  careerDetailSlugs,
  getCareerJobDetail,
  getCareerRoleForDetail,
} from "@/components/careers/jd-data";

export function generateStaticParams() {
  return careerDetailSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const detail = getCareerJobDetail(slug);
  if (!detail) return {};

  return {
    title: `${detail.fullTitle} | Careers at LLM Axis`,
    description: detail.summary,
    alternates: {
      canonical: `https://llmaxis.in/careers/${slug}`,
    },
  };
}

export default async function CareerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = getCareerJobDetail(slug);
  if (!detail) notFound();

  const role = getCareerRoleForDetail(detail);
  if (!role) notFound();

  return <CareerDetailView detail={detail} role={role} />;
}
