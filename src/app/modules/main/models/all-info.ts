import { AllInfoActive } from "./all-info-active";
import { AllInfoRegion } from "./all-info-region";

export interface AllInfo {
    totalRegion: string;
    totalProvince: string;
    site: AllInfoActive;
    battery: AllInfoActive;
    region: AllInfoRegion[];
}
