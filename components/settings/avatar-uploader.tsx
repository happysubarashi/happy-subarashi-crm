"use client";

import { useState, useTransition } from "react";
import { uploadAvatarAction } from "@/lib/actions/profiles";
import { Avatar } from "@/components/ui/elements";
import { Camera } from "lucide-react";

export function AvatarUploader({
  name,
  url,
}: {
  name: string;
  url: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="relative inline-block">
      <Avatar name={name} url={url} size="lg" />
      <label className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-brand-purple-500 flex items-center justify-center cursor-pointer shadow-soft">
        <Camera className="h-3.5 w-3.5 text-white" />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={isPending}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const formData = new FormData();
            formData.append("avatar", file);
            startTransition(async () => {
              const result = await uploadAvatarAction(formData);
              setError(result.error);
            });
          }}
        />
      </label>
      {error && <p className="text-xs text-red-500 mt-1 absolute w-40">{error}</p>}
    </div>
  );
}
