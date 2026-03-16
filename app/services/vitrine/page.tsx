import type { Metadata } from "next";
import { SERVICE_PAGES } from "@/lib/data";
import { buildServiceMetadata, ServicePageLayout } from "@/app/services/_components/service-page-layout";

const page = SERVICE_PAGES.vitrine;

export const metadata: Metadata = buildServiceMetadata({
  page,
  ogTitle: "Sites vitrines premium — Eidos Studio · Bretagne",
  canonicalPath: "/services/vitrine",
});

export default function VitrinePage() {
  return <ServicePageLayout page={page} serviceCode="SVC-02" />;
}
