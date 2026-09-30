import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/catalogo")({ component: CatalogLayout });

function CatalogLayout() {
  return (
    <PageShell>
      <Outlet />
    </PageShell>
  );
}
