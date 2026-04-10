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
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    if (password !== matchPassword) {
      setMatchError("Passwords do not match!");
      return;
    }
    handleRegister();
  };

  return (
    <div className="flex items-center justify-center w-full px-4 sm:px-6 py-8 lg:py-0 lg:min-h-screen">
      <div className="w-full max-w-md">
        <div className="bg-[#141c28] border border-[#1f2d42] rounded-xl p-6 sm:p-8 shadow-[0_0_40px_-5px_rgba(59,130,246,0.3)]">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-1.5 text-white">
              Sign up!
            </h2>
            <p className="text-[#8a9ab8] text-xs sm:text-sm">Or sign in with</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <button
              onClick={() => googleLogin()}
              className="flex items-center justify-center gap-2 py-2 sm:py-2.5 rounded-md border border-[#263548] text-[#8a9ab8] hover:border-blue-500 hover:text-blue-400 transition-all cursor-pointer text-sm"
            >
              <FaGoogle /> <span className="font-medium">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-2 sm:py-2.5 rounded-md border border-[#263548] text-[#8a9ab8] hover:border-blue-500 hover:text-blue-400 transition-all cursor-pointer text-sm">
              <FaGithub /> <span className="font-medium">GitHub</span>
            </button>
          </div>

          <form
            autoComplete="off"
            className="space-y-4 sm:space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-xs font-bold text-[#536480] uppercase px-1">
                Full Name
              </label>
              <div className="relative">
                <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-[#536480] text-base sm:text-lg" />
                <input
                  type="text"
                  name="name"
                  value={name}
                  autoComplete="off"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan dela Cruz"
                  className="w-full bg-[#0d1219] border border-[#263548] rounded-md py-2.5 sm:py-3 pl-9 sm:pl-10 pr-4 text-xs sm:text-sm text-white placeholder-[#536480] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
            </div>

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
              <label className="text-[10px] sm:text-xs font-bold text-[#536480] uppercase px-1">
                Password
              </label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#536480] text-base sm:text-lg" />
                <input
                  type="password"
                  name="password"
                  value={password}
                  autoComplete="new-password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="••••••••"
                  className={`w-full bg-[#0d1219] border rounded-md py-2.5 sm:py-3 pl-9 sm:pl-10 pr-4 text-xs sm:text-sm text-white placeholder-[#536480] focus:outline-none focus:ring-1 transition-all ${
                    passwordError
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-[#263548] focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  required
                />
              </div>
              {passwordError && (
                <p className="text-red-400 text-[11px] sm:text-xs px-1">{passwordError}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-xs font-bold text-[#536480] uppercase px-1">
                Confirm Password
              </label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#536480] text-base sm:text-lg" />
                <input
                  type="password"
                  name="confirm-password"
                  value={matchPassword}
                  autoComplete="new-password"
                  onChange={(e) => {
                    setMatchPassword(e.target.value);
                    setMatchError("");
                  }}
                  placeholder="••••••••"
                  className={`w-full bg-[#0d1219] border rounded-md py-2.5 sm:py-3 pl-9 sm:pl-10 pr-4 text-xs sm:text-sm text-white placeholder-[#536480] focus:outline-none focus:ring-1 transition-all ${
                    matchError
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-[#263548] focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  required
                />
              </div>
              {matchError && (
                <p className="text-red-400 text-[11px] sm:text-xs px-1">{matchError}</p>
              )}
            </div>

            <button
              type="submit"
              className={`${loading ? "cursor-not-allowed bg-blue-400" : "cursor-pointer bg-blue-500 hover:bg-blue-400 hover:-translate-y-0.5"} w-full text-white font-bold py-2.5 sm:py-3 rounded-md mt-2 transition-all shadow-lg shadow-blue-500/20 text-sm sm:text-base`}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-[#8a9ab8]">
            Already have an account?{" "}
            <button
              onClick={() => setShowRegister(false)}
              className="text-blue-400 font-bold hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}