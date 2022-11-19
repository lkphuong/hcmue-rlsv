export interface FormResponse {
  ref?: string;
  parent_id: string;
  version?: string;
  original?: string;
  control: number;
  content: string;
  form_mark: number;
  to_mark: number;
  category: number;
  unit: number;
  required: boolean;
}
