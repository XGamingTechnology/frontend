// src/types/layers.ts
export interface LayerDefinition {
  id: string; // ID unik untuk layer, misal: 'toponimi', 'batimetri'
  name: string; // Nama yang ditampilkan, misal: 'Toponimi', 'Bathymetri'
  description: string; // Deskripsi singkat
  color?: string; // Warna default untuk layer ini (opsional)
  // Tambahkan properti lain jika diperlukan, seperti 'type', 'source', dll.
}

// Tipe untuk state visibilitas layer
export type LayerVisibilityState = Record<string, boolean>; // { 'toponimi': true, 'batimetri': false, ... }
