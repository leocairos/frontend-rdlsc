export interface IAuxiliar {
  value: string;
}

export interface IDataSampleAnalysis {
  id?: number;
  sample_id?: number;
  analise?: string;
  display_value?: string;
  measurement_unit?: string;
  conclusion?: string;
}
export interface IDataSample {
  id?: number;
  sample_type?: string;
  taken_date_time?: string;
  collection_point?: string;
  sample_conclusion?: string;
  updated_at?: string;
  sample_status?: string;
}

export interface ISampleAPIResponse {
  id: number;
  sample_type: string;
  taken_date_time: Date;
  sample_conclusion: string;
  collection_point: string;
  updated_at: Date;
  sample_status: string;
  observation?: string;
  lote?: string;
}
