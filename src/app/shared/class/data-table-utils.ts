import { DataTableState } from "../models/data-table-state";
import { DataTablePageable } from "../models/data-table-pageable";
import { HttpParams } from "@angular/common/http";

export default class DataTableUtils {
    static saveState(key: string, params: any, pageable: DataTablePageable) {
        let state: DataTableState = {
            params: params,
            pageable: pageable
        };
        sessionStorage.setItem(key, JSON.stringify(state));
    }

    static getState(key: string): DataTableState {
        let data = sessionStorage.getItem(key)
        if (data) {
            return JSON.parse(data) as DataTableState;
        }
        return null;
    }

    static clearState(key: string) {
        sessionStorage.removeItem(key);
    }

    static sort(map: any, key: string, value: string) {
        for (const mk in map) {
            map[mk] = (mk === key ? value : null);
        }
        return map;
    }

    static getPageable(): DataTablePageable {
        return {
            pageIndex: 1,
            pageSize: 10,
            total: 0,
            loading: false,
            sortValue: null,
            sortKey: null
        };
    }

    static generateParams(pageable: DataTablePageable): HttpParams {
        let httpParams = new HttpParams()
            .set("page", pageable.pageIndex)
            .set("limit", "10");
        return httpParams;
    }

    
    static generateParamsLimit(pageable: DataTablePageable): HttpParams {
        let httpParams = new HttpParams()
            .set("page", pageable.pageIndex)
            .set("limit", pageable.pageSize);
        return httpParams;
    }


    static generateParamsHttp(pageable: DataTablePageable): URLSearchParams {
        let params = new URLSearchParams();
        params.append('page', pageable.pageIndex);
        params.append('limit', "10");
        return params;
    }
}