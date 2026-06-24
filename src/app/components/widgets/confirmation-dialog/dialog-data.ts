export interface DialogData {
  title?: string;
  content?: string;
  primaryActionBtnTitle?: string; // Is the action we want to take. For example Save, Delete
  secondaryActionBtnTitle?: string; // Permits the user to exist without executing the primary action. For example Cancel
  isPrimaryButtonLeft?: boolean; // Indicates the position of the primary action. If the primary action is on the left, the default button is the secondary action.
  width?: string;
  height?: string
}
