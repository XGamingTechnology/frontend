// src/components/panels/ToponimiPanel.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { useTool } from "@/context/ToolContext";
import { useData } from "@/context/DataContext";

interface Icon {
  id: number;
  filename: string;
  name: string;
  slug: string;
  category_slug: string;
  category_name: string;
  is_custom?: boolean;
  url?: string;
}

interface ToponimiPanelProps {
  onClose: () => void;
}

const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const Tooltip = ({ children, label }: { children: React.ReactNode; label: string }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 duration-100 scale-95 group-hover:scale-100">
        {label}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );
};

export default function ToponimiPanel({ onClose }: ToponimiPanelProps) {
  const { formLatLng, setFormLatLng, showToponimiForm, setShowToponimiForm } = useTool();
  const { refreshData } = useData();

  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [icons, setIcons] = useState<Icon[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔽 State untuk upload ikon
  const [customIconFile, setCustomIconFile] = useState<File | null>(null);
  const [customIconName, setCustomIconName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 16, y: 80 });

  // Muat posisi dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem("toponimiPanelPosition");
    if (saved) {
      try {
        const pos = JSON.parse(saved);
        const isValid = pos && typeof pos.x === "number" && typeof pos.y === "number";
        if (isValid) {
          const boundedX = Math.max(0, Math.min(pos.x, window.innerWidth - 384));
          const boundedY = Math.max(0, Math.min(pos.y, window.innerHeight - 300));
          setPosition({ x: boundedX, y: boundedY });
        }
      } catch (e) {
        console.warn("Gagal parse posisi ToponimiPanel", e);
      }
    }
  }, []);

  const savePosition = (x: number, y: number) => {
    const boundedX = Math.max(0, Math.min(x, window.innerWidth - 384));
    const boundedY = Math.max(0, Math.min(y, window.innerHeight - 300));
    setPosition({ x: boundedX, y: boundedY });
    localStorage.setItem("toponimiPanelPosition", JSON.stringify({ x: boundedX, y: boundedY }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || !panelRef.current) return;
    e.preventDefault();

    const rect = panelRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setIsDragging(true);

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;
      savePosition(newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: false });
    document.addEventListener("mouseup", handleMouseUp, { once: true });
  };

  // --- Ambil ikon dari API ---
  useEffect(() => {
    let isMounted = true;

    const fetchIcons = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/toponimi-icons", {
          method: "GET",
          headers: getAuthHeaders(),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

        const responseData = await res.json();

        if (!Array.isArray(responseData)) {
          console.error("Format respons ikon tidak valid", responseData);
          return;
        }

        // ✅ Proses ikon: bedakan custom dan bawaan
        const typedIcons = (responseData as Icon[]).map((icon) => ({
          ...icon,
          url: icon.is_custom ? `http://localhost:5000/icons/custom/${icon.filename}` : `/icons/${icon.slug}.png`,
        }));

        if (isMounted) {
          setIcons(typedIcons);
          if (typedIcons.length > 0 && !selectedIcon) {
            setSelectedIcon(typedIcons[0]);
          }
        }
      } catch (err) {
        console.error("❌ Gagal ambil ikon:", err);
        if (isMounted) {
          setError("Gagal memuat ikon. Cek koneksi atau server.");
        }
      }
    };

    fetchIcons();

    return () => {
      isMounted = false;
    };
  }, [selectedIcon]);

  const filteredIcons = activeCategory === "all" ? icons : icons.filter((icon) => icon.category_slug === activeCategory);
  const categories = ["all", ...Array.from(new Set(icons.map((i) => i.category_slug)))];

  // --- Submit ---
  const handleSubmit = async () => {
    if (!formLatLng || !nama.trim() || !selectedIcon) {
      alert("Mohon lengkapi nama lokasi dan pilih ikon.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const pointGeoJSON = {
      type: "Point",
      coordinates: [formLatLng.lng, formLatLng.lat] as [number, number],
    };

    // ✅ Gunakan path ikon yang benar
    const iconPath = selectedIcon.is_custom
      ? selectedIcon.filename // hanya nama file
      : `${selectedIcon.slug}.png`; // slug + .png

    const variables = {
      layerType: "toponimi_user",
      name: nama.trim(),
      description: deskripsi.trim() || null,
      geometry: pointGeoJSON,
      source: "manual",
      meta: {
        icon: iconPath,
        category: selectedIcon.category_slug,
        is_custom: selectedIcon.is_custom, // ✅ FIX: HARUS DITAMBAH!
      },
    };

    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          query: `
            mutation CreateSpatialFeature(
              $layerType: String!
              $name: String
              $description: String
              $geometry: GeometryInput!
              $source: String
              $meta: MetadataInput
            ) {
              createSpatialFeature(
                layerType: $layerType
                name: $name
                description: $description
                geometry: $geometry
                source: $source
                meta: $meta
              ) {
                id
              }
            }
          `,
          variables,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0]?.message || "Gagal menyimpan data.");
      }

      if (result.data?.createSpatialFeature?.id) {
        alert("📍 Toponimi berhasil ditambahkan!");
        setNama("");
        setDeskripsi("");
        refreshData();
        setTimeout(() => {
          setFormLatLng(null);
          setShowToponimiForm(false);
          onClose();
        }, 100);
      } else {
        throw new Error("Tidak ada ID yang dikembalikan.");
      }
    } catch (err: any) {
      console.error("❌ [ToponimiPanel] Gagal simpan toponimi:", err);
      const errorMsg = err.message || "Tidak dapat terhubung ke server.";
      setError(errorMsg);
      alert(`Gagal menyimpan: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Fungsi Upload Ikon Kustom
  const handleUploadCustomIcon = async () => {
    if (!customIconFile || !customIconName) return;

    const formData = new FormData();
    formData.append("file", customIconFile);
    formData.append("name", customIconName);
    formData.append("category_slug", "custom");

    setIsUploading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/upload/icon", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Upload gagal");
      }

      const data = await res.json();
      const newIcon = {
        ...data.icon,
        url: `http://localhost:5000/icons/custom/${data.icon.filename}`,
      };

      // Tambahkan ke daftar ikon
      setIcons((prev) => [newIcon, ...prev]);
      setSelectedIcon(newIcon);
      setCustomIconFile(null);
      setCustomIconName("");
      alert("✅ Ikon berhasil diupload!");
    } catch (err: any) {
      console.error("❌ Gagal upload ikon:", err);
      setError(`Upload gagal: ${err.message}`);
      alert(`Gagal upload: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelAndClose = () => {
    if (confirm("Yakin hapus marker dan batalkan?")) {
      setFormLatLng(null);
      setShowToponimiForm(false);
      onClose();
    }
  };

  return (
    <div
      ref={panelRef}
      className="absolute z-[1000] bg-white rounded-xl shadow-xl p-5 w-96 max-w-[95vw] border border-gray-200"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(0, 0)",
        willChange: isDragging ? "transform" : "auto",
        cursor: isDragging ? "grabbing" : "grab",
        maxHeight: "90vh",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 cursor-grab active:cursor-grabbing select-none" onMouseDown={handleMouseDown}>
        <h3 className="text-xl font-bold text-gray-800">📍 Tambah Toponimi</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition" aria-label="Tutup panel">
          ×
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">{error}</div>}

      <div className="space-y-4">
        <input
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama lokasi"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-800 placeholder-gray-400 bg-white"
          autoFocus
        />

        <textarea
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          placeholder="Deskripsi (opsional)"
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-800 placeholder-gray-400 resize-none bg-white"
        />

        <div className="flex gap-1 overflow-x-auto pb-1 mb-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1 text-sm rounded whitespace-nowrap transition ${activeCategory === cat ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}>
              {cat === "all" ? "Semua" : cat.split("_").join(" ")}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto">
          {filteredIcons.length > 0 ? (
            filteredIcons.map((icon) => (
              <Tooltip key={icon.id} label={icon.name}>
                <div onClick={() => setSelectedIcon(icon)} className={`p-1 border-2 rounded cursor-pointer transition ${selectedIcon?.id === icon.id ? "border-blue-500 shadow-sm" : "border-transparent hover:border-gray-300"}`}>
                  <img
                    src={icon.url}
                    alt={icon.name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/icons/Bendera_1.png";
                    }}
                  />
                </div>
              </Tooltip>
            ))
          ) : (
            <div className="col-span-8 text-center text-gray-500 text-sm py-4">Tidak ada ikon</div>
          )}
        </div>

        {selectedIcon && (
          <div className="mt-3 p-3 border rounded bg-gray-50 text-center">
            <img
              src={selectedIcon.url}
              alt="Preview ikon terpilih"
              className="w-12 h-12 object-contain mx-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/icons/Bendera_1.png";
              }}
            />
            <p className="text-sm mt-2 font-medium text-gray-800 break-words leading-tight">{selectedIcon.name}</p>
            <p className="text-xs text-gray-500 mt-1 capitalize">Kategori: {selectedIcon.category_name}</p>
            <p className="text-xs text-green-600 mt-1 font-mono">✅ File: {selectedIcon.filename || `${selectedIcon.slug}.png`}</p>
            {selectedIcon.is_custom && <p className="text-xs text-blue-600 mt-1">🔖 Ikon Kustom</p>}
          </div>
        )}

        {/* 🔽 Upload Ikon Kustom */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="font-semibold text-sm text-gray-800 mb-2">📤 Upload Ikon Kustom</h4>
          <input type="text" placeholder="Nama ikon" value={customIconName} onChange={(e) => setCustomIconName(e.target.value)} className="w-full text-sm px-3 py-2 border border-gray-300 rounded mb-2" />
          <input type="file" accept=".png,.svg,.jpg,.jpeg" onChange={(e) => setCustomIconFile(e.target.files?.[0] || null)} className="text-sm mb-2" />
          <button onClick={handleUploadCustomIcon} disabled={!customIconFile || !customIconName || isUploading} className="text-sm px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400">
            {isUploading ? "Mengunggah..." : "Upload Ikon"}
          </button>
        </div>

        {formLatLng && (
          <div className="text-xs text-gray-500 mt-2 font-mono">
            📍 {formLatLng.lat.toFixed(6)}, {formLatLng.lng.toFixed(6)}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
        <button onClick={handleCancelAndClose} className="flex-1 text-sm px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition">
          Hapus Marker
        </button>
        <button
          onClick={handleSubmit}
          disabled={!nama.trim() || !selectedIcon || isSubmitting}
          className={`flex-1 text-sm px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 transition ${
            !nama.trim() || !selectedIcon || isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-400"
          }`}
        >
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </button>
      </div>

      {isDragging && <div className="absolute inset-0 border-2 border-blue-400 rounded-xl shadow-lg pointer-events-none opacity-80"></div>}
    </div>
  );
}
