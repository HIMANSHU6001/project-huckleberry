export type DataTableColumn<T> = {
    key: keyof T;
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    format?: (value: any) => string | number | React.ReactNode;
};

export interface DataTableProps<T extends { id: string }> {
    columns: DataTableColumn<T>[];
    data: T[];
    onEdit: (record: T) => void;
    onDelete: (record: T) => void;
}

export type SortConfig = {
    key: string | null;
    direction: "asc" | "desc";
};
