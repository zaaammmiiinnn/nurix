import React from "react";
import { getAdminProjects } from "@/app/admin/portfolio/actions";
import { PortfolioCrud } from "@/components/admin/portfolio-crud";

export default async function AdminPortfolioPage() {
  const projects = await getAdminProjects();

  return <PortfolioCrud initialProjects={projects} />;
}
