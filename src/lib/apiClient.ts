// src/lib/apiClient.ts
import { getAuthToken, removeAuthToken } from "@/lib/auth";

/**
 * Fungsi bantu: Ambil headers dengan token
 * Jika token expired → hapus dari localStorage
 */
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Fungsi bantu: Fetch dengan otomatis cek 401
 */
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const headers = getAuthHeaders();

  const res = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    // Token tidak valid → logout otomatis
    removeAuthToken();
    window.dispatchEvent(new Event("auth:logout"));
  }

  return res;
};
