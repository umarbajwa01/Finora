import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Download, LogOut, Sun, Moon, Monitor } from "lucide-react";
import Input from "../components/common/Input";
import Select from "../components/common/Select";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { userApi, downloadCSVBlob } from "../api/user.api";
import { getErrorMessage } from "../api/axios";
import { CURRENCIES } from "../constants/categories";
import { USE_MOCK } from "../constants/config";
import { mockTransactions } from "../mocks/mockData";
import "./Settings.css";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(60),
  currency: z.string(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [profileMsg, setProfileMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || "", currency: user?.currency || "USD" },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSaveProfile = async (values) => {
    setProfileMsg("");
    if (!USE_MOCK) {
      await userApi.updateMe(values);
    }
    updateUser(values);
    setProfileMsg("Profile updated successfully.");
  };

  const onChangePassword = async (values) => {
    setPasswordErr("");
    setPasswordMsg("");
    try {
      if (!USE_MOCK) {
        await userApi.changePassword(values);
      }
      setPasswordMsg("Password changed successfully.");
      passwordForm.reset();
    } catch (err) {
      setPasswordErr(getErrorMessage(err));
    }
  };

  const initials = (user?.name || "F").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  const [exporting, setExporting] = useState(false);
  const handleExport = async () => {
    setExporting(true);
    try {
      if (USE_MOCK) {
        // Build the same CSV shape the real backend endpoint produces, from mock data.
        const header = "Date,Type,Category,Amount,Description,PaymentMethod\n";
        const rows = mockTransactions
          .map(
            (t) =>
              `${t.date.split("T")[0]},${t.type},${t.category},${t.amount},"${(t.description || "").replace(/"/g, '""')}",${t.paymentMethod}`
          )
          .join("\n");
        downloadCSVBlob(header + rows, "finora-transactions.csv");
      } else {
        await userApi.exportTransactions();
      }
    } catch (err) {
      setProfileMsg("");
      setPasswordErr(getErrorMessage(err));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="settings-page">
      <section className="settings-section">
        <h3 className="font-display">Profile</h3>
        <div className="settings-section__body">
          <div className="settings-avatar-row">
            <div className="settings-avatar">{initials}</div>
            <div>
              <div className="settings-avatar__name">{user?.name}</div>
              <div className="settings-avatar__email">{user?.email}</div>
            </div>
          </div>
          <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="settings-form">
            <Input label="Full name" error={profileForm.formState.errors.name?.message} {...profileForm.register("name")} />
            <Input label="Email" value={user?.email} disabled />
            <Select label="Currency" {...profileForm.register("currency")}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
            {profileMsg && <p className="settings-success">{profileMsg}</p>}
            <Button type="submit" loading={profileForm.formState.isSubmitting} style={{ alignSelf: "flex-start" }}>
              Save changes
            </Button>
          </form>
        </div>
      </section>

      <section className="settings-section">
        <h3 className="font-display">Appearance</h3>
        <div className="settings-section__body">
          <div className="theme-picker">
            {[
              { value: "light", label: "Light", icon: Sun },
              { value: "dark", label: "Dark", icon: Moon },
              { value: "system", label: "System", icon: Monitor },
            ].map((opt) => (
              <button
                key={opt.value}
                className={`theme-picker__option${theme === opt.value ? " is-active" : ""}`}
                onClick={() => setTheme(opt.value)}
              >
                <opt.icon size={18} />
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="settings-section">
        <h3 className="font-display">Security</h3>
        <div className="settings-section__body">
          <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="settings-form">
            <Input label="Current password" type="password" error={passwordForm.formState.errors.currentPassword?.message} {...passwordForm.register("currentPassword")} />
            <Input label="New password" type="password" error={passwordForm.formState.errors.newPassword?.message} {...passwordForm.register("newPassword")} />
            <Input label="Confirm new password" type="password" error={passwordForm.formState.errors.confirmPassword?.message} {...passwordForm.register("confirmPassword")} />
            {passwordErr && <p className="settings-error">{passwordErr}</p>}
            {passwordMsg && <p className="settings-success">{passwordMsg}</p>}
            <Button type="submit" variant="secondary" loading={passwordForm.formState.isSubmitting} style={{ alignSelf: "flex-start" }}>
              Update password
            </Button>
          </form>
        </div>
      </section>

      <section className="settings-section">
        <h3 className="font-display">Data & Account</h3>
        <div className="settings-section__body settings-actions">
          <Button variant="secondary" icon={Download} loading={exporting} onClick={handleExport}>
            Export transactions (CSV)
          </Button>
          <Button variant="danger" icon={LogOut} onClick={logout}>Log out</Button>
        </div>
      </section>
    </div>
  );
};

export default Settings;
