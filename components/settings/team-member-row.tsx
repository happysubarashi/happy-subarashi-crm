"use client";

import { useTransition } from "react";
import {
  updateMemberRoleAction,
  updateMemberManagerAction,
  toggleMemberActiveAction,
} from "@/lib/actions/team";
import { Avatar } from "@/components/ui/elements";
import { Select } from "@/components/ui/select";
import { ROLE_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Profile, UserRole } from "@/types/database.types";

export function TeamMemberRow({
  member,
  leaders,
  isSelf,
  canEdit,
}: {
  member: Profile;
  leaders: Profile[];
  isSelf: boolean;
  canEdit: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-brand-purple-50 last:border-0">
      <Avatar name={member.full_name} url={member.avatar_url} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-zinc-800 truncate">
          {member.full_name} {isSelf && <span className="text-zinc-400">(Anda)</span>}
        </p>
        <p className="text-xs text-zinc-400 truncate">{member.email}</p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {member.role === "consultant" && canEdit && (
          <Select
            className="h-9 text-xs w-32"
            defaultValue={member.managed_by ?? ""}
            disabled={isPending}
            onChange={(e) =>
              startTransition(() =>
                updateMemberManagerAction(member.id, e.target.value || null)
              )
            }
          >
            <option value="">Tanpa Leader</option>
            {leaders.map((l) => (
              <option key={l.id} value={l.id}>
                {l.full_name}
              </option>
            ))}
          </Select>
        )}

        {canEdit && !isSelf && member.role !== "owner" ? (
          <Select
            className="h-9 text-xs w-28"
            defaultValue={member.role}
            disabled={isPending}
            onChange={(e) =>
              startTransition(() =>
                updateMemberRoleAction(member.id, e.target.value as UserRole)
              )
            }
          >
            {(["admin", "leader", "consultant"] as UserRole[]).map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r]}
              </option>
            ))}
          </Select>
        ) : (
          <span className="text-xs font-medium text-brand-purple-500 px-2">
            {ROLE_LABEL[member.role]}
          </span>
        )}

        {canEdit && !isSelf && member.role !== "owner" && (
          <button
            disabled={isPending}
            onClick={() =>
              startTransition(() => toggleMemberActiveAction(member.id, !member.is_active))
            }
            className={cn(
              "h-6 w-11 rounded-full relative transition-colors flex-shrink-0",
              member.is_active ? "bg-emerald-400" : "bg-zinc-200"
            )}
            aria-label="Toggle active"
          >
            <span
              className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                member.is_active ? "translate-x-[22px]" : "translate-x-0.5"
              )}
            />
          </button>
        )}
      </div>
    </div>
  );
}
