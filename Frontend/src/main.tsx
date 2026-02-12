/**
 * Точка входа приложения.
 * Подключает глобальные стили и i18n до рендера, монтирует React в #root.
 */
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import "./app/i18n";
import "./app/styles/index.scss";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(<App />);
