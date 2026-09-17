import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import AuthLayout from "./AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../api/axios";
import "./AuthShared.css";

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(60),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.boolean().refine((v) => v === true, "You must accept the terms to continue"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", terms: false },
  });

  const onSubmit = async (values) => {
    setServerError("");
    try {
      await registerUser(values);
      navigate("/", { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  };

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create your account"
      subtitle="Set up your Finora profile in under a minute."
      footer={<>Already have an account? <Link to="/login">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Input label="Full name" icon={User} placeholder="Eleanor Whitfield" error={errors.name?.message} {...register("name")} />
        <Input label="Email" type="email" icon={Mail} placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
        <Input label="Password" type="password" icon={Lock} placeholder="At least 8 characters" error={errors.password?.message} {...register("password")} />
        <Input label="Confirm password" type="password" icon={Lock} placeholder="Repeat your password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />

        <label className="auth-checkbox-row">
          <input type="checkbox" {...register("terms")} />
          <span>I agree to Finora's Terms of Service and Privacy Policy.</span>
        </label>
        {errors.terms && <p className="auth-error">{errors.terms.message}</p>}

        {serverError && <p className="auth-error">{serverError}</p>}

        <Button type="submit" size="lg" loading={isSubmitting}>Create account</Button>
      </form>
    </AuthLayout>
  );
};

export default Register;
