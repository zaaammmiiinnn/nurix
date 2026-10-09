import React from "react";
import { getAdminFaqs } from "@/app/admin/faqs/actions";
import { FaqsCrud } from "@/components/admin/faqs-crud";

export default async function AdminFaqsPage() {
  const faqs = await getAdminFaqs();

  return <FaqsCrud initialFaqs={faqs} />;
}
