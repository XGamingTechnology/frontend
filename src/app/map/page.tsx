// src/app/map/page.tsx
// "use client" mungkin diperlukan tergantung isi MapPageInner
// Jika MapPageInner menggunakan hook React (useState, useEffect, useTool, dll)
// maka MapPageInner sendiri harus "use client".
// Tapi karena MapPageInner adalah komponen kompleks dengan interaktivitas,
// kemungkinan besar sudah "use client". Jika ada error, tambahkan "use client" di sini.
// "use client";

// 1. Impor komponen layout utama halaman peta
import MapPageInner from "./page-inner"; // Pastikan path relatif benar

// 2. Export default komponen halaman yang merender layout utama
export default function MapPage() {
  // 3. ToolProvider dan DataProvider akan tersedia secara otomatis
  //    karena sudah dibungkus di src/app/layout.tsx
  return <MapPageInner />;
}
