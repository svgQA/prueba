import { ColumnDef } from "@tanstack/react-table";
import { Place } from "../utils/places";

export const columns: ColumnDef<Place>[] = [
    {
        id: 'id',
        accessorKey: 'id',
        size: 60,
        header: 'ID',
    },
    {
        id: 'code',
        accessorKey: 'code',
        size: 60,
        header: 'Code',
    },
    {
        id: 'latitude',
        accessorKey: 'latitude',
        size: 60,
        header: 'Latitude',
    },
    {
        id: 'longitude',
        accessorKey: 'longitude',
        size: 60,
        header: 'Longitude',
    },
]