"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-80 space-y-3">
        <h1 className="text-2xl font-bold">Sign Up</h1>

        <input
          className="w-full border p-2"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border p-2"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-green-600 text-white p-2"
          onClick={handleSignup}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
