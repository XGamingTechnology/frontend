// src/lib/auth.ts
/**
 * Ambil token dari localStorage dan cek expired
 */
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("authToken");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000; // dalam milidetik
    const now = Date.now();

    if (now >= exp) {
      // Token expired → bersihkan
      localStorage.removeItem("authToken");
      return null;
    }

    return token;
  } catch (e) {
    localStorage.removeItem("authToken");
    return null;
  }
};

/**
 * Simpan token (opsional: cek payload)
 */
export const setAuthToken = (token: string): void => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (typeof payload.exp !== "number") {
      throw new Error("Token tidak valid");
    }
    localStorage.setItem("authToken", token);
  } catch (e) {
    console.error("Gagal simpan token:", e);
  }
};

/**
 * Hapus token dari localStorage
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem("authToken");
};

/**
 * Cek apakah user login
 */
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};
