"use client";

import { useActionState } from "react";
import { signInAction, type AuthFormState } from "@/lib/actions/auth";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Heart, Lock, Mail } from "lucide-react";
import { Suspense } from "react";

const initialState: AuthFormState = { error: null };

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const [state, formAction, isPending] = useActionState(
    signInAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <div>
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-purple-300" />
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="nama@happysubarashi.com"
            className="pl-10"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-purple-300" />
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="pl-10"
            required
          />
        </div>
      </div>

      {state.error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-3.5 py-2.5">
          {state.error}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full mt-2"
        loading={isPending}
      >
        Masuk
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-purple-50 via-canvas to-brand-pink-50 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        {/* Logo mark */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-brand-purple-500 flex items-center justify-center shadow-card rotate-3">
            <Heart className="h-8 w-8 text-white fill-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-brand-purple-900 mt-4">
            Happy <span className="font-normal italic text-brand-purple-500">subarashi</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Be Happy, Be Healthy, Be Subarashi ✨
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-card border border-brand-purple-50 p-6">
          <p className="text-center text-brand-purple-800 font-medium mb-5">
            Selamat datang kembali, Happy Leader 💜
          </p>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center text-xs text-zinc-400 mt-6">
          Happy Subarashi CRM — Internal Team Access Only
        </p>
      </div>
    </div>
  );
}
