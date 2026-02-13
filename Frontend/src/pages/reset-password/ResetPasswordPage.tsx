import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { resetPassword } from "../../features/auth/api/authApi";

const MIN_PASSWORD_LENGTH = 6;

export const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryToken = (searchParams.get("token") ?? "").trim();

  const [tokenValue, setTokenValue] = useState(queryToken);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const token = tokenValue.trim();
  const tokenMissing = token.length === 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (tokenMissing) {
      setFormError(
        t("auth.errors.resetTokenRequired") ??
          "Reset token is missing. Please use the link from your email.",
      );
      return;
    }

    if (!newPassword || !confirmPassword) {
      setFormError(t("auth.errors.passwordRequired"));
      return;
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setFormError(
        t("auth.errors.passwordTooShort") ??
          "Password must contain at least 6 characters.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError(t("auth.errors.passwordsMismatch"));
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      await resetPassword({ token, newPassword });
      setIsSuccess(true);
    } catch (error) {
      const err = error as {
        response?: { data?: { message?: string; error?: string } };
      };
      const message =
        err?.response?.data?.message ?? err?.response?.data?.error;

      if (message) {
        setFormError(message);
      } else {
        setFormError(
          t("auth.errors.passwordResetFailed") ??
            "Could not reset password. Please request a new reset link.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="auth-form">
        <div className="auth-title">
          {t("auth.passwordResetSuccessTitle") || "Password updated"}
        </div>
        <div className="auth-success">
          {t("auth.passwordResetSuccess") ||
            "Your password has been updated. You can now sign in."}
        </div>
        <button
          className="button primary"
          type="button"
          onClick={() => navigate("/auth/login", { replace: true })}
        >
          {t("auth.backToLogin") || "Back to Login"}
        </button>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-title">
        {t("auth.passwordResetSetTitle") || "Set new password"}
      </div>
      <div className="form-hint">
        {tokenMissing
          ? t("auth.passwordResetTokenMissing") ||
            "Reset token is missing. Open the reset link from your email."
          : t("auth.passwordResetSetHint") ||
            "Create a new password for your account."}
      </div>

      <div className={`field ${formError ? "is-error" : ""}`}>
        <label htmlFor="reset-token">
          {t("auth.resetToken") || "Reset token"}
        </label>
        <input
          id="reset-token"
          type="text"
          placeholder={t("auth.resetTokenPlaceholder") || "Paste token from email"}
          value={tokenValue}
          onChange={(event) => {
            setTokenValue(event.target.value);
            setFormError(null);
          }}
          aria-invalid={Boolean(formError)}
        />
      </div>

      <div className={`field ${formError ? "is-error" : ""}`}>
        <label htmlFor="new-password">
          {t("auth.newPassword") || "New password"}
        </label>
        <input
          id="new-password"
          type="password"
          placeholder={t("auth.newPasswordPlaceholder") || "********"}
          value={newPassword}
          onChange={(event) => {
            setNewPassword(event.target.value);
            setFormError(null);
          }}
          aria-invalid={Boolean(formError)}
        />
      </div>

      <div className={`field ${formError ? "is-error" : ""}`}>
        <label htmlFor="confirm-password">
          {t("auth.passwordConfirm") || "Confirm password"}
        </label>
        <input
          id="confirm-password"
          type="password"
          placeholder={t("auth.passwordConfirmPlaceholder") || "********"}
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            setFormError(null);
          }}
          aria-invalid={Boolean(formError)}
        />
      </div>

      {formError ? (
        <div id="auth-error" className="error-text" role="alert">
          {formError}
        </div>
      ) : null}

      <button className="button primary" type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? t("auth.resettingPassword") || "Saving..."
          : t("auth.savePassword") || "Save password"}
      </button>
      <button
        className="auth-link"
        type="button"
        onClick={() => navigate("/auth/login")}
      >
        {t("auth.backToLogin") || "Back to Login"}
      </button>
    </form>
  );
};

export default ResetPasswordPage;
