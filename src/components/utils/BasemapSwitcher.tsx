"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  onChange: (type: string) => void;
  current: string;
  defaultPosition?: { x: number; y: number };
};

export default function BasemapSwitcher({ onChange, current, defaultPosition }: Props) {
  const basemaps = [
    { id: "osm", label: "OSM", icon: "/icons/map1.png" },
    { id: "satellite", label: "Satellite", icon: "/icons/map2.png" },
    { id: "terrain", label: "Terrain", icon: "/icons/map3.png" },
  ];

  const active = basemaps.find((b) => b.id === current) || basemaps[0];

  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const [open, setOpen] = useState(false);

  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    if (defaultPosition) return defaultPosition;
    if (typeof window !== "undefined") {
      const bottomPadding = 100; // default offset above location button
      return { x: 20, y: window.innerHeight - bottomPadding };
    }
    return { x: 1900, y: 3000 }; // fallback
  });

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Drag logic
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!isDragging.current) return;
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    }

    function handleMouseUp() {
      isDragging.current = false;
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  function handleMouseDown(e: React.MouseEvent) {
    if (!dragRef.current) return;
    isDragging.current = true;
    const rect = dragRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  return (
    <div ref={dragRef} className="fixed z-[999] cursor-grab" style={{ top: position.y, left: position.x }} onMouseDown={handleMouseDown}>
      <div ref={panelRef} className="relative">
        <button onClick={() => setOpen(!open)} className="bg-white/90 p-1 rounded-full border shadow hover:scale-105 transition" title="Pilih Basemap">
          <Image src={active.icon} alt={active.label} width={40} height={40} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -30, y: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -30, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-0 mt-3 mr-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg ring-1 ring-black/5 p-1 flex flex-row gap-1"
            >
              {basemaps.map((base) => (
                <button
                  key={base.id}
                  onClick={() => {
                    onChange(base.id);
                    setOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center px-2 py-1.5 rounded-xl hover:bg-cyan-50 transition-all duration-200 ${current === base.id ? "bg-cyan-100 font-semibold" : ""}`}
                >
                  <div className="w-6 h-6 relative">
                    <Image src={base.icon} alt={base.label} fill className="object-contain" />
                  </div>
                  <span className="text-[10px] text-gray-700 mt-1 leading-none">{base.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
