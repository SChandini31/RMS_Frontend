import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Mail,
  Lock,
  GraduationCap,
  ShieldCheck,
  BarChart3,
  FileText,
} from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const API_BASE = "https://rms-897z.onrender.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, formData);

      if (!res.data?.token || !res.data?.user) {
        setErrorMsg("Invalid login response from server");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f7f8f7]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[38%_62%]">
        <div className="flex items-center justify-center bg-[#f8f8f6] px-6 py-8 sm:px-10 lg:px-14 border-r border-[#e5ebe8]">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-[#f4b400] text-white shadow-[0_10px_30px_rgba(244,180,0,0.2)] flex items-center justify-center ring-4 ring-[#fff5d8]">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h1 className="text-[20px] font-bold text-[#163B67]">
                    The Apollo University
                  </h1>
                  <p className="text-sm text-[#163B67]">
                    Research Management System
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-[#eef7f5] px-3 py-1 border border-[#d8ebe6] text-[11px] font-semibold text-[#2b7a78]">
                <ShieldCheck size={13} />
                AUTHORIZED ACCESS
              </div>

              <h2 className="mt-5 text-[30px] leading-tight font-bold text-[#12373d]">
                Welcome Back!
              </h2>

              <p className="mt-3 text-[14px] text-[#6f807d] leading-7">
                Use the credentials provided by your Super Admin to access the
                platform.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-[12px] font-semibold tracking-[0.18em] text-[#6e827f] mb-2">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9bb0ad]"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full h-12 rounded-xl border border-[#d3dfdc] bg-white pl-11 pr-4 text-sm text-[#183c40] placeholder:text-[#9aacaa] outline-none focus:ring-2 focus:ring-[#71cfc8]/30 focus:border-[#40b8b0]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold tracking-[0.18em] text-[#6e827f] mb-2">
                  PASSWORD
                </label>
                <div className="relative">
                  <Lock
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9bb0ad]"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full h-12 rounded-xl border border-[#d3dfdc] bg-white pl-11 pr-20 text-sm text-[#183c40] placeholder:text-[#9aacaa] outline-none focus:ring-2 focus:ring-[#71cfc8]/30 focus:border-[#40b8b0]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-medium text-[#31a9a0]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-[#f4b400] hover:bg-[#e2a700] text-[#163236] text-sm font-semibold shadow-[0_10px_24px_rgba(244,180,0,0.2)]"
              >
                {loading ? "Signing in..." : "Sign In to Dashboard"}
              </button>
            </form>

            <div className="mt-8 border-t border-[#e7ece9] pt-6">
              <p className="text-sm text-[#71827f] leading-7">
                Need access?{" "}
                <span className="font-medium text-[#32a89f]">
                  <a
                    href="mailto:schandini062@gmail.com"
                    className="hover:cursor-pointer"
                  >
                    Contact your administrator
                  </a>
                </span>{" "}
                to receive credentials.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex relative items-center justify-center overflow-hidden text-white bg-[linear-gradient(180deg,#0f5d61_0%,#0d6c70_45%,#0fa5ad_100%)] px-10 xl:px-16 py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.10),transparent_26%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,210,84,0.10),transparent_24%)]" />
          <div className="absolute bottom-[-60px] right-[-40px] h-72 w-72 rounded-full bg-[#17c3c8]/20 blur-3xl" />
          <div className="absolute top-[8%] left-[8%] h-28 w-28 rounded-full border border-white/10" />
          <div className="absolute top-[14%] right-[12%] h-16 w-16 rounded-3xl bg-white/10 rotate-12" />
          <div className="absolute bottom-[6%] left-[8%] h-20 w-20 rounded-3xl bg-white/10 -rotate-12" />

          <div className="relative z-10 max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[#f1c35b] font-bold">
              RMS Platform · The Apollo University
            </p>

            <h3 className="mt-5 text-[48px] leading-[1.08] font-bold max-w-xl text-white">
              Accelerate your research potential.
            </h3>

            <p className="mt-5 max-w-xl text-[15px] leading-7 text-white/85">
              A unified platform for publications, audit trails, performance
              metrics, and role-based university workflows built for clarity and
              control.
            </p>

            <div className="mt-10 space-y-4 max-w-xl">
              <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/12 flex items-center justify-center text-white">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-[15px] text-white">
                      Publications
                    </p>
                    <p className="text-sm text-white/75 mt-1 leading-6">
                      Centralized repository for faculty and student publication
                      records.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/12 flex items-center justify-center text-white">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-[15px] text-white">
                      Role-Based Security
                    </p>
                    <p className="text-sm text-white/75 mt-1 leading-6">
                      Structured access for students, faculty, admins, and
                      university leaders.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/12 flex items-center justify-center text-white">
                    <BarChart3 size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-[15px] text-white">
                      Performance Metrics
                    </p>
                    <p className="text-sm text-white/75 mt-1 leading-6">
                      Monitor KPIs, dashboards, analytics, and institutional
                      progress.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-8 text-sm text-white/80">
              <div>
                <p className="text-2xl font-bold text-white">4+</p>
                <p className="mt-1">Core Modules</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">100%</p>
                <p className="mt-1">Role Aware</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#f4b400]">RMS</p>
                <p className="mt-1">Unified Access</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
