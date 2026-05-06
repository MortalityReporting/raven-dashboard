import {Input} from "@angular/core";

export type HeaderConfig = {
  title?: string;
  subtitle?: string;
  version?: string;
  backgroundColor?: string;
  splitSubtitleEvenly?: boolean;
  showUserManagement?: boolean; // TODO: Needs user management config.
  menuItem?: menuItem[];
}

type menuItem = {
  divider?: boolean;
  label?: string;
  link?: string; // Should be urL.
}
