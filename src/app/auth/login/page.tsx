
import { LoginForm } from "@/components/login-form";

export default function Page() {
    return (
        <div className="flex w-full min-h-svh items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <LoginForm />
            </div>
        </div>
        // <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        //     <div className="flex flex-col gap-1">
        //         <div className="flex flex-col gap-1">
        //             <input type="email" placeholder="Email" className="border-1" value={email} onChange={(x) => setEmail(x.target.value)}></input>
        //             <input type="password" placeholder="Password" className="border-1" value={password} onChange={(x) => setPassword(x.target.value)}></input>
        //             <button className="border-1 cursor-pointer" onClick={emailLogin}>Login</button>
        //             <button className="border-1 cursor-pointer" onClick={emailSignup}>Signup</button>
        //         </div>
        //         <button className="border-1 cursor-pointer" onClick={() => {
        //             oauthLogin("google")
        //         }}>Google</button>
        //         <button className="border-1 cursor-pointer" onClick={() => {
        //             oauthLogin("discord")
        //         }}>Discord</button>
        //     </div>
        // </div>
    );
}
