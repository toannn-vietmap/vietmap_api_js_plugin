import { Boundary } from 'models/boundary';
export interface TSearchResponse {
  'odata.count': number;
  value: Array<{
    ref_id: string;
    address: string;
    name: string;
    display: string;
    boundaries: Array<Boundary>;
  }>;
}
