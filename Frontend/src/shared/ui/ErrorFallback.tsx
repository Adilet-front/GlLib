/**
 * Экран при непойманной ошибке (показывает ErrorBoundary).
 * Кнопка «Попробовать снова» сбрасывает границу и перерисовывает дерево;
 * «Обновить страницу» — полная перезагрузка.
 */
type ErrorFallbackProps = {
  error?: Error;
  onReset?: () => void;
};

export const ErrorFallback = ({ error, onReset }: ErrorFallbackProps) => {
  const isDev = import.meta.env.DEV;
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div
      role="alert"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "var(--surface)",
        color: "var(--purple-900)",
        fontFamily: "var(--font-family, inherit)",
      }}
    >
      <div
        style={{
          maxWidth: 420,
          textAlign: "center",
          display: "grid",
          gap: 16,
        }}
      >
        <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>
          Что-то пошло не так
        </h1>
        <p style={{ fontSize: "0.9375rem", color: "#6b5b7d" }}>
          Произошла ошибка. Попробуйте обновить страницу или вернуться позже.
        </p>
        {error && isDev && (
          <pre
            style={{
              padding: 12,
              background: "var(--surface-soft)",
              borderRadius: 12,
              fontSize: "0.8125rem",
              textAlign: "left",
              overflow: "auto",
              maxHeight: 120,
            }}
          >
            {error.message}
          </pre>
        )}
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              style={{
                padding: "10px 20px",
                borderRadius: 999,
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--purple-700)",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.9375rem",
              }}
            >
              Попробовать снова
            </button>
          )}
          <button
            type="button"
            onClick={handleReload}
            style={{
              padding: "10px 20px",
              borderRadius: 999,
              border: "none",
              background: "var(--primary)",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.9375rem",
            }}
          >
            Обновить страницу
          </button>
        </div>
      </div>
    </div>
  );
};
