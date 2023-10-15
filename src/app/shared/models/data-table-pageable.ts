export interface DataTablePageable {
    pageIndex: any;
    pageSize: any;
    total: number;
    loading: boolean;
    sortValue: string;
    sortKey: string;
}