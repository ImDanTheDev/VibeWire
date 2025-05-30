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

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    const supabase = createClient();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const emailSignup = async () => {
        if (password !== confirmPassword) return;
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: "/vibe",
                }
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
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                        Enter your email and password below to sign up
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
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" required value={password}
                                    onChange={(x) => setPassword(x.target.value)} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="password">Confirm Password</Label>
                                <Input id="password" type="password" required value={confirmPassword}
                                    onChange={(x) => setConfirmPassword(x.target.value)} />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full" onClick={emailSignup}>
                                    Sign up
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <a href="/auth/login" className="underline underline-offset-4">
                                Login
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
