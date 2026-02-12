import {Gender} from "../components/search-records/decedent-records-grid/decedent-records-grid.component";
import {DeathDateRange} from "./death-date-range";

export interface GridSearchParams {
  deathDate?: DeathDateRange,
  gender?: Gender
}
