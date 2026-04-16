import { FaGithub, FaGoogle } from "react-icons/fa";
import { MdEmail, MdLock } from "react-icons/md";
import { useLogin } from "../context/LoginContext";
import { useGoogleLogin } from "@react-oauth/google";
import api from "../lib/api";
import { usePage } from "../context/PageContext";
import { useRegister } from "../context/RegisterContext";
import { useCurrentUser } from "../context/CurrentUserContext";
import { useEffect } from "react";

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

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
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
      }
    },
    onError: () => console.log("Login Failed"),
  });

  const githubLogin = () => {
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
        }
      };
      handleGithubCallback();
    }
  }, []);

  return (
    <div className="w-full bg-[#0d1219] border border-white/5 rounded-sm p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16 rounded-full" />

      <div className="relative z-10">
        <div className="mb-10">
          <h2 className="text-3xl font-black tracking-tighter uppercase text-white mb-2">
            Hello, Welcome!
          </h2>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Identity verification required
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            onClick={() => googleLogin()}
            className="flex items-center justify-center gap-3 py-4 rounded-sm border border-white/5 bg-white/2 text-slate-400 hover:border-white/20 hover:text-white transition-all cursor-pointer text-[10px] font-black uppercase tracking-widest"
          >
            <FaGoogle size={14} /> Google
          </button>
          <button
            onClick={githubLogin}
            className="flex items-center justify-center gap-3 py-4 rounded-sm border border-white/5 bg-white/2 text-slate-400 hover:border-white/20 hover:text-white transition-all cursor-pointer text-[10px] font-black uppercase tracking-widest"
          >
            <FaGithub size={14} /> GitHub
          </button>
        </div>

        <div className="relative flex items-center gap-4 mb-8">
          <div className="grow h-px bg-white/5"></div>
          <span className="text-[9px] text-slate-700 uppercase font-black tracking-[0.3em] whitespace-nowrap">
            Credentials
          </span>
          <div className="grow h-px bg-white/5"></div>
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
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Email Address
            </label>
            <div className="relative">
              <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full bg-white/2 border border-white/5 rounded-sm py-4 pl-12 pr-4 text-xs font-black text-white placeholder-slate-800 outline-none focus:border-blue-500/50 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Password
              </label>
              {/* <button
                type="button"
                className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:underline"
              >
                Recovery
              </button> */}
            </div>
            <div className="relative">
              <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/2 border border-white/5 rounded-sm py-4 pl-12 pr-4 text-xs font-black text-white placeholder-slate-800 outline-none focus:border-blue-500/50 transition-all"
                required
              />
            </div>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-500/5 border border-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest text-center">
              {loginError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-sm font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl ${
              loading
                ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-500 cursor-pointer shadow-blue-600/10"
            }`}
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
            New here?{" "}
            <button
              onClick={() => setShowRegister(true)}
              className="text-white cursor-pointer hover:text-blue-500 transition-colors"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
