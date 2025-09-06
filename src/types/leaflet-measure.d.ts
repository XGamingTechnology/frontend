// src/types/leaflet-measure.d.ts
declare module "leaflet-measure" {
  import * as L from "leaflet";
  namespace L {
    namespace Control {
      interface Measure {
        new (options?: any): Control;
        addTo(map: L.Map): any;
        remove(): void;
      }
    }
  }

  const Measure: L.Control.Measure;
  export = Measure;
}
