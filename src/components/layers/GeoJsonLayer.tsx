// import { useEffect, useState } from "react";
// import { GeoJSON } from "react-leaflet";
// import * as L from "leaflet";
// import { useTool } from "@/context/ToolContext"; // ⬅️ Gunakan context (atau ganti sesuai kebutuhan)

// type Props = {
//   url: string;
//   popupField: string;
//   color?: string;
//   radius?: number;
//   marker?: boolean;
// };

// const buoyIcon = new L.Icon({
//   iconUrl: "/icons/buoy.png",
//   iconSize: [32, 32],
//   iconAnchor: [16, 32],
//   popupAnchor: [0, -32],
// });

// export default function GeoJsonLayer({ url, popupField, color = "#ff0000", radius = 5, marker = false }: Props) {
//   const [data, setData] = useState<any>(null);
//   const { setGeojsonData } = useTool(); // ⬅️ Ambil setter dari context

//   useEffect(() => {
//     fetch(url)
//       .then((res) => res.json())
//       .then((json) => {
//         setData(json);
//         setGeojsonData(json); // ⬅️ Simpan ke context
//       })
//       .catch((err) => console.error("Gagal memuat GeoJSON:", err));
//   }, [url, setGeojsonData]);

//   if (!data) return null;

//   return (
//     <GeoJSON
//       data={data}
//       pointToLayer={(feature, latlng) =>
//         marker
//           ? L.marker(latlng, { icon: buoyIcon }).bindPopup(`<strong>${feature.properties[popupField]}</strong>`)
//           : L.circleMarker(latlng, {
//               radius,
//               fillColor: color,
//               color,
//               weight: 1,
//               fillOpacity: 0.8,
//             }).bindPopup(`${popupField}: ${feature.properties[popupField]}`)
//       }
//     />
//   );
// }
