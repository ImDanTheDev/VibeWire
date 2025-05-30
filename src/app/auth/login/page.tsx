"use client";

import { createClient } from "@/lib/supabase/client";
import { Provider } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
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

    const emailSignup = async () => {
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: "/vibe"
                }
            });

            if (error) throw error;

            router.push("/vibe");
        } catch (error: unknown) {
            console.log(JSON.stringify(error));
        }
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="flex flex-col gap-1">
                <div className="flex flex-col gap-1">
                    <input type="email" placeholder="Email" className="border-1" value={email} onChange={(x) => setEmail(x.target.value)}></input>
                    <input type="password" placeholder="Password" className="border-1" value={password} onChange={(x) => setPassword(x.target.value)}></input>
                    <button className="border-1 cursor-pointer" onClick={emailLogin}>Login</button>
                    <button className="border-1 cursor-pointer" onClick={emailSignup}>Signup</button>
                </div>
                <button className="border-1 cursor-pointer" onClick={() => {
                    oauthLogin("google")
                }}>Google</button>
                <button className="border-1 cursor-pointer" onClick={() => {
                    oauthLogin("discord")
                }}>Discord</button>
            </div>
        </div>
    );
}
