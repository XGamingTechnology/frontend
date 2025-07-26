import { useTool } from "@/context/ToolContext";

interface ToolButtonProps {
  icon: React.ReactNode;
  value: "toponimi" | "rute"; // harus sama dengan type Tool
  tooltip: string;
}

export default function ToolButton({ icon, value, tooltip }: ToolButtonProps) {
  const { activeTool, setActiveTool } = useTool();
  const isActive = activeTool === value;

  const toggle = () => {
    setActiveTool(isActive ? null : value); // toggle nyala/mati
  };

  return (
    <button
      onClick={toggle}
      title={tooltip}
      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md border transition-all duration-200 text-lg ${isActive ? "bg-indigo-600 text-white ring-2 ring-indigo-300" : "bg-white text-gray-700 hover:bg-indigo-100"}`}
    >
      {icon}
    </button>
  );
}
