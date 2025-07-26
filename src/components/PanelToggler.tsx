import { LayoutPanelLeft, LayoutPanelTop } from "lucide-react";
import { MdViewSidebar } from "react-icons/md";

interface PanelTogglerProps {
  onToggleLeft: () => void;
  onToggleRight: () => void;
  onToggleBottom: () => void;
}

export default function PanelToggler({ onToggleLeft, onToggleRight, onToggleBottom }: PanelTogglerProps) {
  return (
    <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
      <button onClick={onToggleLeft} className="bg-white/70 backdrop-blur border border-gray-300 rounded-lg shadow p-2 hover:bg-white transition" title="Toggle Sidebar Kiri" aria-label="Toggle Sidebar Kiri">
        <LayoutPanelLeft className="w-5 h-5 text-gray-700" />
      </button>

      <button onClick={onToggleRight} className="bg-white/70 backdrop-blur border border-gray-300 rounded-lg shadow p-2 hover:bg-white transition" title="Toggle Sidebar Kanan" aria-label="Toggle Sidebar Kanan">
        <MdViewSidebar className="w-5 h-5 text-gray-700 rotate-180" />
      </button>

      <button onClick={onToggleBottom} className="bg-white/70 backdrop-blur border border-gray-300 rounded-lg shadow p-2 hover:bg-white transition" title="Toggle Panel Bawah" aria-label="Toggle Panel Bawah">
        <LayoutPanelTop className="w-5 h-5 text-gray-700 rotate-180" />
      </button>
    </div>
  );
}
