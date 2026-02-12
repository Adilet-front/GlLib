/**
 * Конфиг Vite: сборка и dev-сервер.
 * Плагин react включает Fast Refresh и поддержку JSX.
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Проксируем API запросы к backend, но не HTML страницы
      "/auth": {
        target: "http://localhost:8080",
        changeOrigin: true,
        bypass(req, _res, _options) {
          if (req.headers.accept?.includes("text/html")) {
            return req.url;
          }
        },
      },
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/users": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/categories": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/books": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/reservations": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
