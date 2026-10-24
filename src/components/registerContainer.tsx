"use client";
import { FaGithub, FaGoogle } from "react-icons/fa6";
import { MdEmail, MdLock, MdPerson } from "react-icons/md";
import { useRegister } from "../context/RegisterContext";
import { useGoogleLogin } from "@react-oauth/google";
import api from "../lib/api";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "../context/CurrentUserContext";
import { useState } from "react";

export default function RegisterContainer() {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleRegister,
    setShowRegister,
    registerError,
  } = useRegister();

  const router = useRouter();
  const { loadUser } = useCurrentUser();
  const [matchPassword, setMatchPassword] = useState("");
  const [matchError, setMatchError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const response = await api.post("/auth/google/callback", {
          token: codeResponse.access_token,
        });
        if (response.data.success) {
          await loadUser();
          router.replace("/interview");
          router.refresh();
        }
      } catch (error) {
        console.error("Google login failed:", error);
      }
    },
    onError: () => console.log("Login Failed"),
  });

  const handleSubmit = () => {
    setMatchError("");
    setPasswordError("");

    if (password.length < 8) {
      setPasswordError("Password must be 8+ characters");
      return;
    }
    if (password !== matchPassword) {
      setMatchError("Passwords do not match");
      return;
    }
    if (!email.includes("@")) {
      setMatchError("Invalid email address");
      return;
    }

    handleRegister();
  };

  return (
    <div className="w-full border border-neutral-700/50 rounded-xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm">
      <div className="absolute top-0 right-0 w-40 h-40 bg-neutral-500/10 blur-3xl -mr-20 -mt-20 rounded-full" />

      <div className="relative z-10">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight uppercase text-white mb-2">
            Create Account
          </h2>
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
            Join us to start your interview prep
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            onClick={() => googleLogin()}
            className="flex items-center justify-center gap-2 py-3 rounded-lg border border-neutral-700/50 bg-neutral-800/40 text-neutral-300 hover:border-neutral-600/50 hover:bg-neutral-800/60 hover:text-white transition-all cursor-pointer text-[10px] font-bold uppercase tracking-widest"
          >
            <FaGoogle size={14} /> Google
          </button>
          <button className="flex items-center justify-center gap-2 py-3 rounded-lg border border-neutral-700/50 bg-neutral-800/40 text-neutral-300 hover:border-neutral-600/50 hover:bg-neutral-800/60 hover:text-white transition-all cursor-pointer text-[10px] font-bold uppercase tracking-widest">
            <FaGithub size={14} /> GitHub
          </button>
        </div>

        <form
          autoComplete="off"
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="space-y-2">
            <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
              Full Name
            </label>
            <div className="relative">
              <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-neutral-800/40 border border-neutral-700/50 rounded-lg py-3 pl-11 pr-4 text-sm font-medium text-white placeholder-neutral-600 outline-none focus:border-neutral-500/50 focus:bg-neutral-800/60 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
              Email Address
            </label>
            <div className="relative">
              <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full bg-neutral-800/40 border border-neutral-700/50 rounded-lg py-3 pl-11 pr-4 text-sm font-medium text-white placeholder-neutral-600 outline-none focus:border-neutral-500/50 focus:bg-neutral-800/60 transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-neutral-800/40 border rounded-lg py-3 pl-11 pr-4 text-sm font-medium text-white placeholder-neutral-600 outline-none transition-all ${
                    passwordError
                      ? "border-neutral-500/50 focus:border-neutral-500/50"
                      : "border-neutral-700/50 focus:border-neutral-500/50 focus:bg-neutral-800/60"
                  }`}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
                Confirm Password
              </label>
              <div className="relative">
                <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="password"
                  value={matchPassword}
                  onChange={(e) => setMatchPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-neutral-800/40 border rounded-lg py-3 pl-11 pr-4 text-sm font-medium text-white placeholder-neutral-600 outline-none transition-all ${
                    matchError
                      ? "border-neutral-500/50 focus:border-neutral-500/50"
                      : "border-neutral-700/50 focus:border-neutral-500/50 focus:bg-neutral-800/60"
                  }`}
                  required
                />
              </div>
            </div>
          </div>

          {(passwordError || matchError || registerError) && (
            <div className="p-3 bg-neutral-500/10 border border-neutral-500/30 text-neutral-400 text-[10px] font-semibold uppercase tracking-widest text-center rounded-lg">
              {passwordError || matchError || registerError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all shadow-lg mt-4 ${
              loading
                ? "bg-neutral-700 text-neutral-600 cursor-not-allowed"
                : "text-white hover: cursor-pointer shadow-neutral-600/20 active:scale-95"
            }`}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">
            Already have an account?{" "}
            <button
              onClick={() => setShowRegister(false)}
              className="text-neutral-400 cursor-pointer hover:text-neutral-300 transition-colors font-bold"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}




