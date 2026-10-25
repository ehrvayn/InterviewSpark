"use client";
import { FaGithub, FaGoogle } from "react-icons/fa6";
import { MdEmail, MdLock } from "react-icons/md";
import { useLogin } from "../context/LoginContext";
import { useGoogleLogin } from "@react-oauth/google";
import api from "../lib/api";
import { useRouter } from "next/navigation";
import { useRegister } from "../context/RegisterContext";
import { useCurrentUser } from "../context/CurrentUserContext";
import { useEffect, useState } from "react";

export default function LoginContainer() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    loading,
    loginError,
  } = useLogin();
  const router = useRouter();
  const { setShowRegister } = useRegister();
  const { loadUser } = useCurrentUser();
  const [oauthLoading, setOauthLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setOauthLoading(true);
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
      } finally {
        setOauthLoading(false);
      }
    },
    onError: () => {
      console.log("Login Failed");
      setOauthLoading(false);
    },
  });

  const githubLogin = () => {
    setOauthLoading(true);
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=user`;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) return;

    window.history.replaceState({}, "", "/");
    setOauthLoading(true);

    (async () => {
      try {
        const response = await api.post("/auth/github/callback", { code });
        if (response.data.success) {
          await loadUser();
          router.replace("/interview");
        }
      } catch (error) {
        console.error("GitHub login failed:", error);
        setOauthLoading(false);
      } finally {
        setOauthLoading(false);
      }
    })();
  }, []);

  return (
    <div className="w-full border border-neutral-700/50 rounded-xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm">
      <div className="absolute top-0 right-0 w-40 h-40 bg-neutral-500/10 blur-3xl -mr-20 -mt-20 rounded-full" />

      {oauthLoading && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 bg-neutral-400 rounded-full animate-bounce"></div>
              <div
                className="w-2.5 h-2.5 bg-neutral-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2.5 h-2.5 bg-neutral-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <p className="text-sm font-semibold text-white uppercase tracking-wide">
              Signing you in...
            </p>
          </div>
        </div>
      )}

      <div className="relative z-10">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight uppercase text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
            Sign in to your account
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            onClick={() => googleLogin()}
            disabled={oauthLoading}
            className="flex items-center justify-center gap-2 py-3 rounded-lg border border-neutral-700/50 bg-neutral-800/40 text-neutral-300 hover:border-neutral-600/50 hover:bg-neutral-800/60 hover:text-white transition-all cursor-pointer text-[10px] font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaGoogle size={14} /> Google
          </button>
          <button
            onClick={githubLogin}
            disabled={oauthLoading}
            className="flex items-center justify-center gap-2 py-3 rounded-lg border border-neutral-700/50 bg-neutral-800/40 text-neutral-300 hover:border-neutral-600/50 hover:bg-neutral-800/60 hover:text-white transition-all cursor-pointer text-[10px] font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaGithub size={14} /> GitHub
          </button>
        </div>

        <div className="relative flex items-center gap-4 mb-8">
          <div className="grow h-px bg-neutral-700/30"></div>
          <span className="text-[9px] text-neutral-500 uppercase font-semibold tracking-widest whitespace-nowrap">
            Email & Password
          </span>
          <div className="grow h-px bg-neutral-700/30"></div>
        </div>

        <form
          autoComplete="off"
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
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

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
                Password
              </label>
            </div>
            <div className="relative">
              <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-800/40 border border-neutral-700/50 rounded-lg py-3 pl-11 pr-4 text-sm font-medium text-white placeholder-neutral-600 outline-none focus:border-neutral-500/50 focus:bg-neutral-800/60 transition-all"
                required
              />
            </div>
          </div>

          {loginError && (
            <div className="p-3 bg-neutral-500/10 border border-neutral-500/30 text-neutral-400 text-[10px] font-semibold uppercase tracking-widest text-center rounded-lg">
              {loginError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all shadow-lg ${
              loading
                ? "bg-neutral-700 text-neutral-600 cursor-not-allowed"
                : "text-black hover:bg-white/80 bg-white cursor-pointer shadow-neutral-600/20 active:scale-95"
            }`}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">
            Don't have an account?{" "}
            <button
              onClick={() => setShowRegister(true)}
              className="text-neutral-400 uppercase cursor-pointer hover:text-neutral-300 transition-colors font-bold"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
