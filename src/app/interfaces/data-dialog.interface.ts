export interface DataDialog {
  body: string;
  title: string;
  actions: boolean;
  icon?: string;
  confirmLabel?: string;
  discardLabel?: string;
  payload?: any;
}

export interface Result {
  result: boolean;
  body?: any;
}
