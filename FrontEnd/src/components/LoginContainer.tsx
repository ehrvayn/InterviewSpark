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
      const handleGithubCallback = async () => {
        try {
          const response = await api.post("/auth/github/callback", { code });
          if (response.data.success) {
            localStorage.setItem("token", response.data.token);
            loadUser();
            window.history.replaceState({}, "", "/");
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
    <div className="flex items-center justify-center w-full px-4 sm:px-6 py-8 lg:py-0 lg:min-h-screen">
      <div className="w-full max-w-md">
        <div className="bg-[#141c28] border border-[#1f2d42] rounded-xl p-6 sm:p-8 shadow-[0_0_40px_-5px_rgba(59,130,246,0.3)]">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-1.5 text-white">
              Hello, Welcome!
            </h2>
            <p className="text-[#8a9ab8] text-xs sm:text-sm">Sign in with</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <button
              onClick={() => googleLogin()}
              className="flex items-center justify-center gap-2 py-2 sm:py-2.5 rounded-md border border-[#263548] text-[#8a9ab8] hover:border-blue-500 hover:text-blue-400 transition-all cursor-pointer text-sm"
            >
              <FaGoogle /> <span className="font-medium">Google</span>
            </button>
            <button
              onClick={githubLogin}
              className="flex items-center justify-center gap-2 py-2 sm:py-2.5 rounded-md border border-[#263548] text-[#8a9ab8] hover:border-blue-500 hover:text-blue-400 transition-all cursor-pointer text-sm"
            >
              <FaGithub /> <span className="font-medium">GitHub</span>
            </button>
          </div>

          <div className="relative flex items-center gap-3 mb-6 sm:mb-8">
            <div className="grow border-t border-[#1f2d42]"></div>
            <span className="text-[10px] text-[#536480] uppercase font-bold tracking-widest whitespace-nowrap">
              Or login with email
            </span>
            <div className="grow border-t border-[#1f2d42]"></div>
          </div>

          <form
            autoComplete="off"
            className="space-y-4 sm:space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-xs font-bold text-[#536480] uppercase px-1">
                Email Address
              </label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#536480] text-base sm:text-lg" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full bg-[#0d1219] border border-[#263548] rounded-md py-2.5 sm:py-3 pl-9 sm:pl-10 pr-4 text-xs sm:text-sm text-white placeholder-[#536480] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] sm:text-xs font-bold text-[#536480] uppercase">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[10px] text-blue-400 hover:underline cursor-pointer"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#536480] text-base sm:text-lg" />
                <input
                  type="password"
                  name="password"
                  value={password}
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0d1219] border border-[#263548] rounded-md py-2.5 sm:py-3 pl-9 sm:pl-10 pr-4 text-xs sm:text-sm text-white placeholder-[#536480] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            {loginError && (
              <p className="text-red-400 text-[11px] sm:text-xs px-1">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className={`${loading ? "cursor-not-allowed bg-blue-400" : "cursor-pointer bg-blue-500 hover:bg-blue-400 hover:-translate-y-0.5"} w-full text-white font-bold py-2.5 sm:py-3 rounded-md mt-2 transition-all shadow-lg shadow-blue-500/20 text-sm sm:text-base`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-[#8a9ab8]">
            Don't have an account?{" "}
            <button
              onClick={() => setShowRegister(true)}
              className="text-blue-400 font-bold hover:underline cursor-pointer"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
