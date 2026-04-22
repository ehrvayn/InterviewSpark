import { FaGithub, FaGoogle } from "react-icons/fa";
import { MdEmail, MdLock, MdPerson } from "react-icons/md";
import { useRegister } from "../context/RegisterContext";
import { useGoogleLogin } from "@react-oauth/google";
import api from "../lib/api";
import { usePage } from "../context/PageContext";
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

  const { setActivePage } = usePage();
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

  const handleSubmit = () => {
    setMatchError("");
    setPasswordError("");

    if (password.length < 8) {
      setPasswordError("Access key must be 8+ characters");
      return;
    }
    if (password !== matchPassword) {
      setMatchError("Passwords do not match");
      return;
    }
    if (!email.includes("@")) {
      setMatchError("Invalid email");
      return;
    }

    handleRegister();
  };

  return (
    <div className="w-full bg-[#0d1219] border border-white/5 rounded-sm p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16 rounded-full" />

      <div className="relative z-10">
        <div className="mb-10">
          <h2 className="text-3xl font-black tracking-tighter uppercase text-white mb-2">
            Create Account
          </h2>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Provide your credentials below
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            onClick={() => googleLogin()}
            className="flex items-center justify-center gap-3 py-4 rounded-sm border border-white/5 bg-white/2 text-slate-400 hover:border-white/20 hover:text-white transition-all cursor-pointer text-[10px] font-black uppercase tracking-widest"
          >
            <FaGoogle size={14} /> Google
          </button>
          <button className="flex items-center justify-center gap-3 py-4 rounded-sm border border-white/5 bg-white/2 text-slate-400 hover:border-white/20 hover:text-white transition-all cursor-pointer text-[10px] font-black uppercase tracking-widest">
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
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Full Name
            </label>
            <div className="relative">
              <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="OPERATOR NAME"
                className="w-full bg-white/2 border border-white/5 rounded-sm py-4 pl-12 pr-4 text-xs font-black text-white placeholder-slate-800 outline-none focus:border-blue-500/50 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Primary Email
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-white/2 border rounded-sm py-4 pl-12 pr-4 text-xs font-black text-white placeholder-slate-800 outline-none transition-all ${
                    passwordError
                      ? "border-rose-500/50"
                      : "border-white/5 focus:border-blue-500/50"
                  }`}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Verify
              </label>
              <div className="relative">
                <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="password"
                  value={matchPassword}
                  onChange={(e) => setMatchPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-white/2 border rounded-sm py-4 pl-12 pr-4 text-xs font-black text-white placeholder-slate-800 outline-none transition-all ${
                    matchError
                      ? "border-rose-500/50"
                      : "border-white/5 focus:border-blue-500/50"
                  }`}
                  required
                />
              </div>
            </div>
          </div>

          {(passwordError || matchError || registerError) && (
            <div className="p-3 bg-rose-500/5 border border-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest text-center">
              {passwordError || matchError || registerError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-sm font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl mt-4 ${
              loading
                ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-500 cursor-pointer shadow-blue-600/10"
            }`}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
            Already have account?{" "}
            <button
              onClick={() => setShowRegister(false)}
              className="text-white cursor-pointer hover:text-blue-500 transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
