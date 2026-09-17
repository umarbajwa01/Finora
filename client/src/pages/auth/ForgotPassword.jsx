import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import AuthLayout from "./AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { authApi } from "../../api/auth.api";
import { getErrorMessage } from "../../api/axios";
import { USE_MOCK } from "../../constants/config";
import "./AuthShared.css";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});

const ForgotPassword = () => {
  const [serverError, setServerError] = useState("");
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  const onSubmit = async (values) => {
    setServerError("");
    try {
      if (!USE_MOCK) {
        await authApi.forgotPassword(values);
      }
      setSent(true);
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  };

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Reset your password"
      subtitle="Enter your email and we'll send you a link to reset your password."
      footer={<><Link to="/login">Back to sign in</Link></>}
    >
      {sent ? (
        <p className="auth-success">
          If an account exists for that email, a reset link is on its way. Check your inbox.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input
            label="Email"
            type="email"
            icon={Mail}
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
          {serverError && <p className="auth-error">{serverError}</p>}
          <Button type="submit" size="lg" loading={isSubmitting}>Send reset link</Button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
