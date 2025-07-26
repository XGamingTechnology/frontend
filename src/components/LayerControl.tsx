interface LayerControlProps {
  layer1Visible: boolean;
  setLayer1Visible: (v: boolean) => void;
  layer2Visible: boolean;
  setLayer2Visible: (v: boolean) => void;
}

export default function LayerControl({ layer1Visible, setLayer1Visible, layer2Visible, setLayer2Visible }: LayerControlProps) {
  return (
    <div className="absolute top-4 right-4 z-50 bg-white rounded shadow p-3 text-sm">
      <h4 className="font-semibold mb-1">🗺️ Layer Control</h4>
      <label className="flex items-center space-x-2">
        <input type="checkbox" checked={layer1Visible} onChange={() => setLayer1Visible(!layer1Visible)} />
        <span>Layer Kabupaten</span>
      </label>
      <label className="flex items-center space-x-2 mt-1">
        <input type="checkbox" checked={layer2Visible} onChange={() => setLayer2Visible(!layer2Visible)} />
        <span>Layer Titik Survey</span>
      </label>
    </div>
  );
}
