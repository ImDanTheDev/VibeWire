"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Provider } from "@supabase/supabase-js";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const oauthLogin = async (provider: Provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: "/vibe",
        }
      });
      if (error) throw error;
      router.push("/vibe");
    } catch (error: unknown) {
      console.log(JSON.stringify(error));
    }
  }

  const emailLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      router.push("/vibe");
    } catch (error: unknown) {
      console.log(JSON.stringify(error));
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(x) => setEmail(x.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* TODO: Implement password reset flow */}
                  <a
                    href="#"
                    onClick={() => alert("not yet implemented")}
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required value={password}
                  onChange={(x) => setPassword(x.target.value)} />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" onClick={emailLogin}>
                  Login
                </Button>
                <Button variant="outline" className="w-full" onClick={() => oauthLogin("google")}>
                  Login with Google
                </Button>
                <Button variant="outline" className="w-full" onClick={() => oauthLogin("discord")}>
                  Login with Discord
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/auth/signup" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
