import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import AuthLayout from "./AuthLayout";
import "./AuthShared.css";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../api/axios";
import { USE_MOCK, GOOGLE_CLIENT_ID } from "../../constants/config";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z" />
    <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.16.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z" />
    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
  </svg>
);

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setServerError("");
    setGoogleLoading(true);
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: USE_MOCK ? "eleanor.whitfield@finora.app" : "", password: USE_MOCK ? "demo1234" : "", rememberMe: true },
  });

  const onSubmit = async (values) => {
    setServerError("");
    try {
      await login(values);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to Finora"
      subtitle="Access your accounts, budgets and financial insights."
      footer={<>New to Finora? <Link to="/register">Create an account</Link></>}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {USE_MOCK && (
          <div className="auth-demo-note">
            Demo mode — any email/password works, or use the pre-filled credentials.
          </div>
        )}
        <Input
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="auth-row">
          <label className="auth-checkbox">
            <input type="checkbox" {...register("rememberMe")} defaultChecked />
            <span>Remember me</span>
          </label>
          <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
        </div>

        {serverError && <p className="auth-error">{serverError}</p>}

        <Button type="submit" size="lg" loading={isSubmitting}>Sign in</Button>
      </form>

      <div className="auth-divider"><span>or continue with</span></div>

      {GOOGLE_CLIENT_ID ? (
        <div className="auth-google-btn">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setServerError("Google sign-in failed. Please try again.")}
            theme="outline"
            shape="pill"
            width="100%"
          />
        </div>
      ) : (
        <Button
          type="button"
          variant="secondary"
          size="lg"
          loading={googleLoading}
          onClick={() => handleGoogleSuccess({ credential: "demo-google-token" })}
        >
          <GoogleIcon /> Continue with Google {USE_MOCK ? "(Demo)" : ""}
        </Button>
      )}
    </AuthLayout>
  );
};

export default Login;
