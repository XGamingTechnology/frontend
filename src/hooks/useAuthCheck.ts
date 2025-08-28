// src/hooks/useAuthCheck.ts
"use client"; // ✅ Tambahkan ini di baris pertama!

import { useEffect } from "react";

export const useAuthCheck = () => {
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const exp = payload.exp * 1000;
        const now = Date.now();

        if (now >= exp) {
          console.log("❌ Token expired, logout otomatis...");
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Token tidak valid, dibersihkan.");
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
    };

    // Cek saat pertama kali
    checkToken();

    // Cek tiap 1 menit
    const interval = setInterval(checkToken, 60000);

    // Cleanup saat unmount
    return () => clearInterval(interval);
  }, []);
};
