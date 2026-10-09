import React from "react";
import { getAdminPricingTiers } from "@/app/admin/pricing/actions";
import { PricingCrud } from "@/components/admin/pricing-crud";

export default async function AdminPricingPage() {
  const tiers = await getAdminPricingTiers();

  return <PricingCrud initialTiers={tiers} />;
}
