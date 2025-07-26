"use client";

import { useMemo, useState } from "react";
import { MaterialReactTable, type MRT_ColumnDef, type MRT_Row } from "material-react-table";
import { Box, IconButton } from "@mui/material";
import { Refresh } from "@mui/icons-material";

export default function AttributeTable() {
  const [data, setData] = useState([
    { id: 1, OBJECTID: 2, NAMOBJ: "Sungai Bengkuluangan", JNSSNG: 0, KLSSNG: 0, FCODE: null, REMARK: "Sungai", SRS_ID: "DA0280", METADATA: null, NAMWS: null },
    { id: 2, OBJECTID: 3, NAMOBJ: "Sungai Keramasan", JNSSNG: 0, KLSSNG: 0, FCODE: null, REMARK: "Sungai", SRS_ID: "DA0280", METADATA: null, NAMWS: null },
    // ... data lainnya
  ]);

  // Definisi kolom
  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      { accessorKey: "id", header: "ID", size: 50 },
      { accessorKey: "OBJECTID", header: "Object ID", size: 100 },
      { accessorKey: "NAMOBJ", header: "Nama Objek", size: 200 },
      { accessorKey: "JNSSNG", header: "Jenis Sungai", size: 100 },
      { accessorKey: "KLSSNG", header: "Kelas Sungai", size: 100 },
      { accessorKey: "FCODE", header: "F Code", size: 100 },
      { accessorKey: "REMARK", header: "Remark", size: 100 },
      { accessorKey: "SRS_ID", header: "SRS ID", size: 100 },
      { accessorKey: "METADATA", header: "Metadata", size: 100 },
      { accessorKey: "NAMWS", header: "Nama WS", size: 100 },
    ],
    []
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <MaterialReactTable
        columns={columns}
        data={data}
        enableColumnResizing
        enableColumnOrdering
        enablePinning
        enableRowNumbers
        enableRowActions
        enablePagination
        enableGlobalFilter
        enableColumnFilters
        initialState={{
          density: "compact",
          pagination: { pageSize: 10, pageIndex: 0 },
        }}
        muiTableContainerProps={{
          sx: { maxHeight: "400px" },
        }}
        renderTopToolbarCustomActions={() => (
          <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <h3 className="text-lg font-semibold">📋 Attribute Table</h3>
            <IconButton onClick={() => console.log("Refresh data")}>
              <Refresh />
            </IconButton>
          </Box>
        )}
        muiTablePaperProps={{
          elevation: 0,
          sx: {
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
          },
        }}
      />
    </div>
  );
}
