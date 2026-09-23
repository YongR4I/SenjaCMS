"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"
import { ArrowRightIcon, LockKeyholeIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth-store"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)
  const authLoading = useAuthStore((s) => s.isLoading)
  const [error, setError] = React.useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    const data = new FormData(event.currentTarget)
    try {
      await login(String(data.get("email") ?? ""), String(data.get("password") ?? ""))
      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal. Pastikan BE online.")
    }
  }

  return (
    <div
      className={cn("grid min-h-[720px] overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_100px_rgba(18,18,18,0.18)] lg:grid-cols-[0.95fr_1.05fr]", className)}
      {...props}
    >
      <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12">
        <Link href="/login" className="flex w-fit items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-senja-black text-lg font-black text-senja-cyan">S</span>
          <span>
            <span className="block text-lg font-black leading-none tracking-[-0.04em]">SENJA</span>
            <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Content Studio</span>
          </span>
        </Link>

        <form className="my-12 max-w-md" onSubmit={handleSubmit}>
          <div className="mb-9">
            <span className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-secondary">
              <LockKeyholeIcon className="size-5" />
            </span>
            <p className="page-eyebrow">Secure workspace</p>
            <h1 className="text-4xl font-black tracking-[-0.05em] sm:text-5xl">Welcome back.</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Sign in to manage the Senja digital experience.</p>
          </div>

          <FieldGroup className="gap-5">
            <Field>
              <FieldLabel htmlFor="email">Email address</FieldLabel>
              <Input id="email" name="email" type="email" placeholder="admin@senja.id" required />
            </Field>
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <a href="#" className="ml-auto text-xs font-semibold text-muted-foreground hover:text-foreground">
                  Forgot password?
                </a>
              </div>
              <Input id="password" name="password" type="password" placeholder="Enter your password" required />
            </Field>
            {error ? (
              <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <Button type="submit" size="lg" className="mt-2 w-full" disabled={authLoading}>
              {authLoading ? "Signing in…" : "Sign in to CMS"} <ArrowRightIcon />
            </Button>
          </FieldGroup>
        </form>

        <p className="text-xs leading-5 text-muted-foreground">Protected content management system · Senja © 2026</p>
      </div>

      <div className="relative hidden overflow-hidden bg-senja-black p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 size-80 rounded-full border-[70px] border-senja-cyan" />
        <div className="absolute -bottom-32 -left-32 size-96 rounded-full border-[84px] border-senja-orange" />
        <div className="absolute left-[46%] top-[24%] h-[52%] w-px rotate-[28deg] bg-white/15" />
        <div className="relative flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-white/45">
          <span>Technology × Experience</span>
          <span className="senja-dot mr-5" />
        </div>
        <div className="relative max-w-lg">
          <p className="text-5xl font-black leading-[0.93] tracking-[-0.055em] xl:text-6xl">
            Spaces with purpose. Content with clarity.
          </p>
          <p className="mt-7 max-w-md text-base leading-7 text-white/55">
            One modern workspace for the stories, projects, and partnerships that shape Senja.
          </p>
        </div>
      </div>
    </div>
  )
}
