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
    <div className="login-page">
      <div className="login-grid">
        <div className="login-form-panel">
          <div className="login-form-inner">
            <div className="mb-8">
              <div className="login-brand">
                <div className="login-logo">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h1 className="login-brand-title">The Apollo University</h1>
                  <p className="login-brand-subtitle">
                    Research Management System
                  </p>
                </div>
              </div>

              <div className="login-badge">
                <ShieldCheck size={13} />
                AUTHORIZED ACCESS
              </div>

              <h2 className="login-heading">Welcome Back!</h2>

              <p className="login-description">
                Use the credentials provided by your Super Admin to access the
                platform.
              </p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              <div>
                <label className="login-label">EMAIL ADDRESS</label>
                <div className="login-input-wrap">
                  <Mail size={17} className="login-input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="login-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="login-label">PASSWORD</label>
                <div className="login-input-wrap">
                  <Lock size={17} className="login-input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="login-input login-input--password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="login-toggle-password"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {errorMsg && <div className="alert-error">{errorMsg}</div>}

              <button
                type="submit"
                disabled={loading}
                className="login-submit"
              >
                {loading ? "Signing in..." : "Sign In to Dashboard"}
              </button>
            </form>

            <div className="login-footer">
              <p className="login-footer-text">
                Need access?{" "}
                <span className="login-footer-link">
                  <a href="mailto:schandini062@gmail.com">
                    Contact your administrator
                  </a>
                </span>{" "}
                to receive credentials.
              </p>
            </div>
          </div>
        </div>

        <div className="login-hero">
          <div className="login-hero-glow" />
          <div className="login-hero-shape-1" />
          <div className="login-hero-shape-2" />
          <div className="login-hero-shape-3" />

          <div className="login-hero-content">
            <p className="login-hero-tag">
              RMS Platform · The Apollo University
            </p>

            <h3 className="login-hero-title">
              Accelerate your research potential.
            </h3>

            <p className="login-hero-text">
              A unified platform for publications, audit trails, performance
              metrics, and role-based university workflows built for clarity and
              control.
            </p>

            <div className="login-feature-list">
              <div className="login-feature-card">
                <div className="login-feature-row">
                  <div className="login-feature-icon">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="login-feature-title">Publications</p>
                    <p className="login-feature-desc">
                      Centralized repository for faculty and student publication
                      records.
                    </p>
                  </div>
                </div>
              </div>

              <div className="login-feature-card">
                <div className="login-feature-row">
                  <div className="login-feature-icon">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="login-feature-title">Role-Based Security</p>
                    <p className="login-feature-desc">
                      Structured access for students, faculty, admins, and
                      university leaders.
                    </p>
                  </div>
                </div>
              </div>

              <div className="login-feature-card">
                <div className="login-feature-row">
                  <div className="login-feature-icon">
                    <BarChart3 size={18} />
                  </div>
                  <div>
                    <p className="login-feature-title">Performance Metrics</p>
                    <p className="login-feature-desc">
                      Monitor KPIs, dashboards, analytics, and institutional
                      progress.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="login-stats">
              <div>
                <p className="login-stat-value">4+</p>
                <p className="login-stat-label">Core Modules</p>
              </div>
              <div>
                <p className="login-stat-value">100%</p>
                <p className="login-stat-label">Role Aware</p>
              </div>
              <div>
                <p className="login-stat-value login-stat-value--highlight">
                  RMS
                </p>
                <p className="login-stat-label">Unified Access</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
