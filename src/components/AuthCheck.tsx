// src/components/AuthCheck.tsx
"use client";

import { useAuthCheck } from "@/hooks/useAuthCheck";

// ✅ Ini adalah Client Component
export default function AuthCheck() {
  useAuthCheck(); // ✅ Boleh dipanggil di sini karena sudah 'use client'
  return null; // Tidak render apa-apa
}
