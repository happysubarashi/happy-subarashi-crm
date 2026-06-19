"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Search, SlidersHorizontal, Flame, X } from "lucide-react";
import { PIPELINE_STAGES, LEAD_SOURCES } from "@/lib/constants";
import { debounce } from "@/lib/utils";
import type { Profile } from "@/types/database.types";

export function LeadFilters({ teamMembers }: { teamMembers: Profile[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  const debouncedSearch = debounce((value: string) => {
    updateParam("search", value || null);
  }, 400);

  const activeFilterCount = [
    searchParams.get("stage"),
    searchParams.get("source"),
    searchParams.get("assignedTo"),
    searchParams.get("hot"),
  ].filter(Boolean).length;

  return (
    <div className="px-4 lg:px-8 pb-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-purple-300" />
          <Input
            placeholder="Cari nama, nomor, atau kode lead..."
            className="pl-10"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              debouncedSearch(e.target.value);
            }}
          />
        </div>
        <button
          onClick={() => setSheetOpen(true)}
          className="relative h-11 w-11 flex-shrink-0 rounded-xl border border-brand-purple-100 bg-white flex items-center justify-center text-brand-purple-600"
        >
          <SlidersHorizontal className="h-[18px] w-[18px]" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-brand-pink-500 text-white text-[10px] flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
        <button
          onClick={() => updateParam("hot", searchParams.get("hot") ? null : "1")}
          className={`h-11 w-11 flex-shrink-0 rounded-xl border flex items-center justify-center transition-colors ${
            searchParams.get("hot")
              ? "bg-red-50 border-red-200 text-red-500"
              : "bg-white border-brand-purple-100 text-brand-purple-300"
          }`}
        >
          <Flame className="h-[18px] w-[18px]" />
        </button>
      </div>

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Filter Lead">
        <div className="space-y-4 pb-2">
          <div>
            <label className="text-sm font-medium text-brand-purple-800 mb-1.5 block">
              Status Pipeline
            </label>
            <Select
              defaultValue={searchParams.get("stage") ?? "all"}
              onChange={(e) => updateParam("stage", e.target.value)}
            >
              <option value="all">Semua Status</option>
              {PIPELINE_STAGES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-brand-purple-800 mb-1.5 block">
              Sumber Lead
            </label>
            <Select
              defaultValue={searchParams.get("source") ?? "all"}
              onChange={(e) => updateParam("source", e.target.value)}
            >
              <option value="all">Semua Sumber</option>
              {LEAD_SOURCES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-brand-purple-800 mb-1.5 block">
              Ditugaskan Ke
            </label>
            <Select
              defaultValue={searchParams.get("assignedTo") ?? "all"}
              onChange={(e) => updateParam("assignedTo", e.target.value)}
            >
              <option value="all">Semua Tim</option>
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name}
                </option>
              ))}
            </Select>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              router.push(pathname);
              setSheetOpen(false);
            }}
          >
            <X className="h-4 w-4" /> Reset Filter
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
