import { AllInfoRegionDetail } from "./all-info-region-detail";

export interface AllInfoRegion {
   regionId: number;
   regionName: string;
   regionStatus: string;
   information: AllInfoRegionDetail;
}
