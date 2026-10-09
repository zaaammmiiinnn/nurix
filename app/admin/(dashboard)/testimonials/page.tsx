import React from "react";
import { getAdminTestimonials } from "@/app/admin/testimonials/actions";
import { TestimonialsCrud } from "@/components/admin/testimonials-crud";

export default async function AdminTestimonialsPage() {
  const testimonials = await getAdminTestimonials();

  return <TestimonialsCrud initialTestimonials={testimonials} />;
}
