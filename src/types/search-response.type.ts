import { Boundary } from 'models/boundary';
export interface TSearchResponse {
  ref_id: string;
  address: string;
  name: string;
  display: string;
  boundaries: Array<Boundary>;
}



