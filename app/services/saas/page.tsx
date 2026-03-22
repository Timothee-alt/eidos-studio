import type { Metadata } from "next";
import { SERVICE_PAGES } from "@/lib/data/services";
import { buildServiceMetadata, ServicePageLayout } from "@/app/services/_components/service-page-layout";

const page = SERVICE_PAGES.saas;

export const metadata: Metadata = buildServiceMetadata({
  page,
  ogTitle: "Applications SaaS sur mesure — Eidos Studio",
  canonicalPath: "/services/saas",
});

export default function SaasPage() {
  return <ServicePageLayout page={page} serviceCode="SVC-03" />;
}
