import React from "react";
import { getAdminServices } from "@/app/admin/services/actions";
import { ServicesCrud } from "@/components/admin/services-crud";

export default async function AdminServicesPage() {
  const services = await getAdminServices();

  return <ServicesCrud initialServices={services} />;
}
