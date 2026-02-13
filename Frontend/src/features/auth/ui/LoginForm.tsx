/**
 * Форма входа и регистрации (mode: "login" | "register").
 * Пошаговый флоу: email → пароль (логин) или intro → код → пароль+профиль (регистрация).
 * Поля пароля с переключателем видимости (глаз) и анимацией моргания/ripple.
 */
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { forgotPassword, login, register } from "../api/authApi";
import { useAuth } from "../model/useAuth";
import { setAccessToken } from "../../../shared/lib/auth/token";
import {
  FORGOT_PASSWORD_COOLDOWN_MS,
  getForgotPasswordCooldownMs,
  setForgotPasswordCooldown,
} from "../../../shared/lib/auth/forgotPasswordCooldown";

type Step =
  | "email"
  | "password"
  | "register-form"
  | "forgot-password";

type LoginFormProps = {
  mode?: "login" | "register";
};

export const LoginForm = ({ mode = "login" }: LoginFormProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as
    | { prefillEmail?: string; from?: { pathname?: string } }
    | null;
  const prefillEmail = locationState?.prefillEmail ?? "";
  const initialStep: Step = mode === "register" ? "register-form" : "email";
  const [isShaking, setIsShaking] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [values, setValues] = useState({
    email: prefillEmail,
    password: "",
  });
  const [step, setStep] = useState<Step>(initialStep);
  const [registerPasswords, setRegisterPasswords] = useState({
    password: "",
    confirm: "",
  });
  const [registerProfile, setRegisterProfile] = useState({
    firstName: "",
    lastName: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);
  const [ripple, setRipple] = useState<"login" | "reg-pass" | "reg-confirm" | null>(null);
  const { signIn } = useAuth();

  const handleToggleWithRipple = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    which: "login" | "reg-pass" | "reg-confirm"
  ) => {
    setter((v) => !v);
    setRipple(which);
  };
  const clearRipple = () => setRipple(null);

  const EyeIcon = ({ open }: { open: boolean }) => (
    <svg
      className="password-toggle__icon"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {open ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = values.email.trim();
    const password = values.password.trim();
    let shouldShake = false;

    if (step === "email") {
      if (!email) {
        setFormError(t("auth.errors.emailRequired"));
        shouldShake = true;
      } else if (!email.includes("@")) {
        setFormError(t("auth.errors.emailInvalid"));
        shouldShake = true;
      } else {
        setFormError(null);
        setStep(mode === "register" ? "register-form" : "password");
        return;
      }
    } else if (step === "password") {
      if (!password) {
        setFormError(t("auth.errors.passwordRequired"));
        shouldShake = true;
      } else {
        setFormError(null);
        try {
          const { data } = await login({ email, password });
          setAccessToken(data.token);
          await signIn({ email });
          const redirectTo = locationState?.from?.pathname ?? "/";
          navigate(redirectTo, { replace: true });
          return;
        } catch (error) {
          const err = error as {
            response?: { status?: number; data?: { message?: string; error?: string } };
          };
          const status = err?.response?.status;
          const message =
            err?.response?.data?.message ?? err?.response?.data?.error;
          
          if (status === 400 && message) {
            // Проверяем специфические сообщения об ошибках
            if (message.toLowerCase().includes("email") && message.toLowerCase().includes("confirm")) {
              setFormError(t("auth.errors.emailNotConfirmed") || "Please confirm your email address. Check your inbox for the confirmation link.");
            } else if (message.toLowerCase().includes("not approved") || message.toLowerCase().includes("pending")) {
              setFormError(t("auth.errors.accountNotApproved") || "Your account is pending admin approval. Please wait for administrator to approve your registration.");
            } else if (message.toLowerCase().includes("disabled") || !message.toLowerCase().includes("enabled")) {
              setFormError(t("auth.errors.accountDisabled") || "Your account has been disabled. Please contact the administrator.");
            } else {
              setFormError(message);
            }
            shouldShake = true;
            return;
          }
          if (status === 403) {
            setFormError(t("auth.errors.accountNotApproved") || "Your account is pending admin approval. Please wait for administrator to approve your registration.");
            shouldShake = true;
            return;
          }
          if (status === 404) {
            navigate("/auth/register", {
              replace: true,
              state: { prefillEmail: email },
            });
            return;
          }
          setFormError(t("auth.errors.invalidCredentials"));
          shouldShake = true;
        }
      }
    } else if (step === "forgot-password") {
      // Валидация восстановления пароля
      const resetEmail = forgotPasswordEmail.trim();
      if (!resetEmail) {
        setFormError(t("auth.errors.emailRequired"));
        shouldShake = true;
      } else if (!resetEmail.includes("@")) {
        setFormError(t("auth.errors.emailInvalid"));
        shouldShake = true;
      } else {
        const remainingCooldownMs = getForgotPasswordCooldownMs(resetEmail);
        if (remainingCooldownMs > 0) {
          const remainingMinutes = Math.ceil(remainingCooldownMs / (60 * 1000));
          setFormError(
            t("auth.errors.passwordResetRateLimited", {
              minutes: remainingMinutes,
            }) ??
              `Retry in ${remainingMinutes} minutes.`,
          );
          shouldShake = true;
          return;
        }

        setFormError(null);
        try {
          await forgotPassword({ email: resetEmail });
          setForgotPasswordCooldown(resetEmail, FORGOT_PASSWORD_COOLDOWN_MS);
          setForgotPasswordSuccess(true);
          return;
        } catch (error) {
          const err = error as {
            response?: { data?: { message?: string; error?: string } };
          };
          const message =
            err?.response?.data?.message ?? err?.response?.data?.error;

          setFormError(
            message ??
              t("auth.errors.passwordResetRequestFailed") ??
              "Could not send reset link. Please try again later.",
          );
          shouldShake = true;
        }
      }
    } else if (step === "register-form") {
      // Валидация регистрации
      if (mode === "register") {
        if (!email) {
          setFormError(t("auth.errors.emailRequired"));
          shouldShake = true;
        } else if (!email.includes("@")) {
          setFormError(t("auth.errors.emailInvalid"));
          shouldShake = true;
        }
      }
      const { password: regPass, confirm } = registerPasswords;
      const { firstName, lastName } = registerProfile;
      
      if (shouldShake) {
        // Email validation failed.
      } else if (!firstName || !lastName) {
        setFormError(t("auth.errors.nameRequired") || "First and last name are required");
        shouldShake = true;
      } else if (!regPass || !confirm) {
        setFormError(t("auth.errors.passwordRequired"));
        shouldShake = true;
      } else if (regPass !== confirm) {
        setFormError(t("auth.errors.passwordsMismatch"));
        shouldShake = true;
      } else {
        setFormError(null);
        try {
          await register({ 
            email, 
            password: regPass,
            firstName,
            lastName,
            avatar: avatarFile || undefined
          });
          // Backend возвращает сообщение об ожидании подтверждения email и одобрения админа
          setRegistrationSuccess(true);
          return;
        } catch (error) {
          const err = error as {
            response?: { status?: number; data?: { message?: string; error?: string } };
          };
          const status = err?.response?.status;
          const message =
            err?.response?.data?.message ?? err?.response?.data?.error;
          if (status === 400 && message) {
            setFormError(message);
            shouldShake = true;
            return;
          }
          if (status === 409) {
            setFormError(t("auth.errors.emailAlreadyExists"));
            setStep("password");
            return;
          }
          setFormError(t("auth.errors.registerFailed"));
          shouldShake = true;
        }
      }
    }

    if (shouldShake) {
      setIsShaking(false);
      requestAnimationFrame(() => setIsShaking(true));
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setValues((prev) => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Проверка размера файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormError(t("auth.errors.fileTooLarge") || "File size must be less than 5MB");
        return;
      }
      // Проверка типа файла
      if (!file.type.startsWith("image/")) {
        setFormError(t("auth.errors.invalidFileType") || "Please select an image file");
        return;
      }
      setAvatarFile(file);
      // Создаем превью
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFormError(null);
    }
  };

  const clearAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const showFieldError = Boolean(formError);

  // Показываем сообщение об успешной регистрации
  if (registrationSuccess) {
    return (
      <div className="auth-form">
        <div className="auth-title">{t("auth.registrationSuccess") || "Registration Successful!"}</div>
        <div className="auth-success" style={{ lineHeight: "1.6" }}>
          <p style={{ marginBottom: "12px" }}>
            {t("auth.emailConfirmationSent") || "We've sent a confirmation email to your address. Please check your inbox and confirm your email within 15 minutes."}
          </p>
          <p>
            {t("auth.adminApprovalRequired") || "After confirming your email, your account will be pending admin approval. You will be able to login once an administrator approves your registration."}
          </p>
        </div>
        <button 
          className="button primary" 
          type="button"
          onClick={() => navigate("/auth/login")}
        >
          {t("auth.backToLogin") || "Back to Login"}
        </button>
      </div>
    );
  }

  // Показываем сообщение об успешной отправке письма для восстановления
  if (forgotPasswordSuccess) {
    return (
      <div className="auth-form">
        <div className="auth-title">{t("auth.passwordResetTitle") || "Password Reset"}</div>
        <div className="auth-success">
          {t("auth.passwordResetSent") || "We sent a password reset link to your email. Please check your inbox."}
        </div>
        <button
          className="auth-link"
          type="button"
          onClick={() => navigate("/auth/reset-password")}
        >
          {t("auth.openResetForm") || "Open reset form"}
        </button>
        <button 
          className="button primary" 
          type="button"
          onClick={() => {
            setForgotPasswordSuccess(false);
            setStep("email");
            setFormError(null);
          }}
        >
          {t("auth.backToLogin") || "Back to Login"}
        </button>
      </div>
    );
  }

  return (
    <form
      className={`auth-form ${isShaking ? "auth-form--shake" : ""}`}
      onSubmit={handleSubmit}
      onAnimationEnd={() => setIsShaking(false)}
    >
      {step === "email" ? (
        <div className={`field ${showFieldError ? "is-error" : ""}`}>
          <label htmlFor="email">{t("auth.email")}</label>
          <input
            id="email"
            type="text"
            name="email"
            placeholder="name@company.com"
            inputMode="email"
            value={values.email}
            onChange={handleChange}
            aria-invalid={showFieldError}
            aria-describedby={showFieldError ? "auth-error" : undefined}
          />
        </div>
      ) : step === "password" ? (
        <>
          <div className="form-hint">{values.email}</div>
          <div className={`field ${showFieldError ? "is-error" : ""}`}>
            <label htmlFor="password">{t("auth.password")}</label>
            <div className="password-field">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={values.password}
                onChange={handleChange}
                aria-invalid={showFieldError}
                aria-describedby={showFieldError ? "auth-error" : undefined}
              />
              <button
                type="button"
                className={`password-toggle ${showPassword ? "is-visible" : ""} ${ripple === "login" ? "has-ripple" : ""}`}
                onClick={() => handleToggleWithRipple(setShowPassword, "login")}
                onAnimationEnd={(e) => e.animationName === "toggle-ripple" && clearRipple()}
                aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                tabIndex={-1}
              >
                <span className="password-toggle__icon-wrap" key={String(showPassword)}>
                  <EyeIcon open={showPassword} />
                </span>
              </button>
            </div>
          </div>
        </>
      ) : step === "forgot-password" ? (
        <>
          <div className="auth-title">{t("auth.passwordResetTitle") || "Password Reset"}</div>
          <div className="form-hint">
            {t("auth.passwordResetHint") || "Enter your email and we'll send you a link to reset your password."}
          </div>
          <div className={`field ${showFieldError ? "is-error" : ""}`}>
            <label htmlFor="forgot-email">{t("auth.email")}</label>
            <input
              id="forgot-email"
              type="text"
              name="forgotEmail"
              placeholder="name@company.com"
              inputMode="email"
              value={forgotPasswordEmail}
              onChange={(event) => {
                setForgotPasswordEmail(event.target.value);
                setFormError(null);
              }}
              aria-invalid={showFieldError}
              aria-describedby={showFieldError ? "auth-error" : undefined}
            />
          </div>
        </>
      ) : (
        <>
          <div className="auth-title">
            {mode === "register" ? t("auth.registerTitle") : t("auth.setPasswordTitle")}
          </div>
          {mode === "register" ? (
            <div className={`field ${showFieldError ? "is-error" : ""}`}>
              <label htmlFor="register-email">{t("auth.email")}</label>
              <input
                id="register-email"
                type="text"
                name="email"
                placeholder="name@company.com"
                inputMode="email"
                value={values.email}
                onChange={handleChange}
                aria-invalid={showFieldError}
                aria-describedby={showFieldError ? "auth-error" : undefined}
              />
            </div>
          ) : values.email ? (
            <div className="auth-email-row">
              <span>{values.email}</span>
              <button
                type="button"
                className="auth-link"
                onClick={() => {
                  setStep("email");
                  setFormError(null);
                }}
              >
                {t("auth.editEmail")}
              </button>
            </div>
          ) : null}
          <div className={`field ${showFieldError ? "is-error" : ""}`}>
            <label htmlFor="register-firstName">{t("auth.firstName") || "First Name"}</label>
            <input
              id="register-firstName"
              type="text"
              name="firstName"
              placeholder={t("auth.firstNamePlaceholder") || "John"}
              value={registerProfile.firstName}
              onChange={(event) => {
                setRegisterProfile((prev) => ({
                  ...prev,
                  firstName: event.target.value,
                }));
                setFormError(null);
              }}
              aria-invalid={showFieldError}
              aria-describedby={showFieldError ? "auth-error" : undefined}
            />
          </div>
          <div className={`field ${showFieldError ? "is-error" : ""}`}>
            <label htmlFor="register-lastName">{t("auth.lastName") || "Last Name"}</label>
            <input
              id="register-lastName"
              type="text"
              name="lastName"
              placeholder={t("auth.lastNamePlaceholder") || "Doe"}
              value={registerProfile.lastName}
              onChange={(event) => {
                setRegisterProfile((prev) => ({
                  ...prev,
                  lastName: event.target.value,
                }));
                setFormError(null);
              }}
              aria-invalid={showFieldError}
              aria-describedby={showFieldError ? "auth-error" : undefined}
            />
          </div>
          <div className="field">
            <label htmlFor="register-avatar">{t("auth.avatar") || "Profile Picture (Optional)"}</label>
            <div className="avatar-upload">
              {avatarPreview ? (
                <div className="avatar-preview">
                  <img src={avatarPreview} alt="Avatar preview" className="avatar-preview-image" />
                  <button 
                    type="button" 
                    className="avatar-remove" 
                    onClick={clearAvatar}
                    aria-label="Remove avatar"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label htmlFor="register-avatar" className="avatar-upload-button">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>{t("auth.uploadAvatar") || "Upload Photo"}</span>
                </label>
              )}
              <input
                id="register-avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
            </div>
            <div className="form-hint" style={{ fontSize: "0.75rem", marginTop: "4px" }}>
              {t("auth.avatarHint") || "Max 5MB, JPG, PNG or GIF"}
            </div>
          </div>
          <div className={`field ${showFieldError ? "is-error" : ""}`}>
            <label htmlFor="register-password">{t("auth.password")}</label>
            <div className="password-field">
              <input
                id="register-password"
                type={showRegisterPassword ? "text" : "password"}
                name="registerPassword"
                placeholder={t("auth.passwordPlaceholder")}
                value={registerPasswords.password}
                onChange={(event) => {
                  setRegisterPasswords((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }));
                  setFormError(null);
                }}
                aria-invalid={showFieldError}
                aria-describedby={showFieldError ? "auth-error" : undefined}
              />
              <button
                type="button"
                className={`password-toggle ${showRegisterPassword ? "is-visible" : ""} ${ripple === "reg-pass" ? "has-ripple" : ""}`}
                onClick={() => handleToggleWithRipple(setShowRegisterPassword, "reg-pass")}
                onAnimationEnd={(e) => e.animationName === "toggle-ripple" && clearRipple()}
                aria-label={showRegisterPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                tabIndex={-1}
              >
                <span className="password-toggle__icon-wrap" key={String(showRegisterPassword)}>
                  <EyeIcon open={showRegisterPassword} />
                </span>
              </button>
            </div>
          </div>
          <div className={`field ${showFieldError ? "is-error" : ""}`}>
            <label htmlFor="register-confirm">
              {t("auth.passwordConfirm")}
            </label>
            <div className="password-field">
              <input
                id="register-confirm"
                type={showRegisterConfirm ? "text" : "password"}
                name="registerConfirm"
                placeholder={t("auth.passwordConfirmPlaceholder")}
                value={registerPasswords.confirm}
                onChange={(event) => {
                  setRegisterPasswords((prev) => ({
                    ...prev,
                    confirm: event.target.value,
                  }));
                  setFormError(null);
                }}
                aria-invalid={showFieldError}
                aria-describedby={showFieldError ? "auth-error" : undefined}
              />
              <button
                type="button"
                className={`password-toggle ${showRegisterConfirm ? "is-visible" : ""} ${ripple === "reg-confirm" ? "has-ripple" : ""}`}
                onClick={() => handleToggleWithRipple(setShowRegisterConfirm, "reg-confirm")}
                onAnimationEnd={(e) => e.animationName === "toggle-ripple" && clearRipple()}
                aria-label={showRegisterConfirm ? t("auth.hidePassword") : t("auth.showPassword")}
                tabIndex={-1}
              >
                <span className="password-toggle__icon-wrap" key={String(showRegisterConfirm)}>
                  <EyeIcon open={showRegisterConfirm} />
                </span>
              </button>
            </div>
          </div>
        </>
      )}
      {formError ? (
        <div id="auth-error" className="error-text" role="alert">
          {formError}
        </div>
      ) : null}
      <button className="button primary" type="submit">
        {step === "email"
          ? t("auth.continue")
          : step === "password"
            ? t("auth.signIn")
            : step === "forgot-password"
              ? t("auth.sendResetLink") || "Send Reset Link"
              : t("auth.savePassword")}
      </button>
      {step === "password" ? (
        <button 
          className="auth-link" 
          type="button"
          onClick={() => {
            setStep("forgot-password");
            setForgotPasswordEmail(values.email);
            setFormError(null);
          }}
        >
          {t("auth.forgot")}
        </button>
      ) : null}
      {step === "password" ? (
        <button
          className="auth-link"
          type="button"
          onClick={() => {
            setStep("email");
            setFormError(null);
          }}
        >
          {t("auth.back")}
        </button>
      ) : step === "forgot-password" ? (
        <button
          className="auth-link"
          type="button"
          onClick={() => {
            setStep("password");
            setFormError(null);
          }}
        >
          {t("auth.back")}
        </button>
      ) : null}
      {step === "email" && mode === "login" ? (
        <>
          <div className="auth-divider">
            <span>{t("auth.or") || "or"}</span>
          </div>
          <button
            className="button ghost"
            type="button"
            onClick={() => navigate("/auth/register")}
          >
            {t("auth.createAccount") || "Create New Account"}
          </button>
          <div className="form-hint">{t("auth.hint")}</div>
        </>
      ) : step === "email" ? (
        <div className="form-hint">{t("auth.hint")}</div>
      ) : null}
    </form>
  );
};
