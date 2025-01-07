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
        id: 'name',
        accessorKey: 'name',
        size: 60,
        header: 'Nombre',
    },
    {
        id: 'description',
        accessorKey: 'description',
        size: 60,
        header: 'Descripción',
    },
    {
        id: 'latitude',
        accessorKey: 'latitude',
        size: 60,
        header: 'Latitud',
    },
    {
        id: 'longitude',
        accessorKey: 'longitude',
        size: 60,
        header: 'Longitud',
    },
]