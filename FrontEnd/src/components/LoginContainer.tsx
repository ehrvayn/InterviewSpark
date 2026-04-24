import { FaGithub, FaGoogle } from "react-icons/fa6";
import { MdEmail, MdLock } from "react-icons/md";
import { useLogin } from "../context/LoginContext";
import { useGoogleLogin } from "@react-oauth/google";
import api from "../lib/api";
import { usePage } from "../context/PageContext";
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
  const { setActivePage } = usePage();
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
          localStorage.setItem("token", response.data.token);
          loadUser();
          setActivePage("interview");
        }
      } catch (error) {
        console.error("Google login failed:", error);
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
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&scope=user`;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      window.history.replaceState({}, "", "/");
      const handleGithubCallback = async () => {
        try {
          const response = await api.post("/auth/github/callback", { code });
          if (response.data.success) {
            localStorage.setItem("token", response.data.token);
            loadUser();
            setActivePage("interview");
          }
        } catch (error) {
          console.error("GitHub login failed:", error);
          setOauthLoading(false);
        }
      };
      handleGithubCallback();
    }
  }, []);

  return (
    <div className="w-full bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm">
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 blur-3xl -mr-20 -mt-20 rounded-full" />

      {oauthLoading && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce"></div>
              <div
                className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce"
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
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            Sign in to your account
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            onClick={() => googleLogin()}
            disabled={oauthLoading}
            className="flex items-center justify-center gap-2 py-3 rounded-lg border border-slate-700/50 bg-slate-800/40 text-slate-300 hover:border-slate-600/50 hover:bg-slate-800/60 hover:text-white transition-all cursor-pointer text-[10px] font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaGoogle size={14} /> Google
          </button>
          <button
            onClick={githubLogin}
            disabled={oauthLoading}
            className="flex items-center justify-center gap-2 py-3 rounded-lg border border-slate-700/50 bg-slate-800/40 text-slate-300 hover:border-slate-600/50 hover:bg-slate-800/60 hover:text-white transition-all cursor-pointer text-[10px] font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaGithub size={14} /> GitHub
          </button>
        </div>

        <div className="relative flex items-center gap-4 mb-8">
          <div className="grow h-px bg-slate-700/30"></div>
          <span className="text-[9px] text-slate-500 uppercase font-semibold tracking-widest whitespace-nowrap">
            Email & Password
          </span>
          <div className="grow h-px bg-slate-700/30"></div>
        </div>

        <form
          autoComplete="off"
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className="space-y-2">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Email Address
            </label>
            <div className="relative">
              <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full bg-slate-800/40 border border-slate-700/50 rounded-lg py-3 pl-11 pr-4 text-sm font-medium text-white placeholder-slate-600 outline-none focus:border-blue-500/50 focus:bg-slate-800/60 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                Password
              </label>
            </div>
            <div className="relative">
              <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800/40 border border-slate-700/50 rounded-lg py-3 pl-11 pr-4 text-sm font-medium text-white placeholder-slate-600 outline-none focus:border-blue-500/50 focus:bg-slate-800/60 transition-all"
                required
              />
            </div>
          </div>

          {loginError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-semibold uppercase tracking-widest text-center rounded-lg">
              {loginError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all shadow-lg ${
              loading
                ? "bg-slate-700 text-slate-600 cursor-not-allowed"
                : "bg-linear-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 cursor-pointer shadow-blue-600/20 active:scale-95"
            }`}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
            Don't have an account?{" "}
            <button
              onClick={() => setShowRegister(true)}
              className="text-blue-400 cursor-pointer hover:text-blue-300 transition-colors font-bold"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
