import type { Metadata } from "next";
import { SERVICE_PAGES } from "@/lib/data/services";
import { buildServiceMetadata, ServicePageLayout } from "@/app/services/_components/service-page-layout";

const page = SERVICE_PAGES.ecommerce;

export const metadata: Metadata = buildServiceMetadata({
  page,
  ogTitle: "Sites e-commerce performants — Eidos Studio · Bretagne",
  canonicalPath: "/services/ecommerce",
});

export default function EcommercePage() {
  return <ServicePageLayout page={page} serviceCode="SVC-04" />;
}
