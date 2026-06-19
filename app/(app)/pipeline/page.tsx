import { getKanbanLeads } from "@/lib/queries/leads";
import { PageHeader } from "@/components/layout/page-header";
import { KanbanBoard } from "@/components/leads/kanban-board";
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const buckets = await getKanbanLeads();

  return (
    <div>
      <PageHeader
        title="Pipeline"
        subtitle="Geser kartu atau ketuk panah untuk pindah tahap"
        actions={
          <Link href="/leads">
            <Button variant="outline" size="sm">
              <List className="h-4 w-4" /> List
            </Button>
          </Link>
        }
      />
      <KanbanBoard buckets={buckets} />
    </div>
  );
}
