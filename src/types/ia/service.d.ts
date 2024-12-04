interface IWarning {
  additional_properties: object;
  key: string;
  message: string;
  name: string;
  details: string;
  documentation_link: string;
}

interface IExecutionResult {
  additional_properties?: {
    metrics: any;
  };
  status: string;
  error_message: string | null;
  start_time: string;
  end_time: string;
  errors: any[];
  warnings: IWarning[];
  item_count: number;
  failed_item_count: number;
  initial_tracking_state: string;
  final_tracking_state: string;
}

interface ILimits {
  additional_properties: object;
  max_run_time: number;
  max_document_extraction_size: number;
  max_document_content_characters_to_extract: number;
}

export interface IModelStatus {
  additional_properties: {
    name: string;
  };
  status: string;
  last_result: IExecutionResult | null;
  execution_history: IExecutionResult[];
  limits: ILimits;
}

export interface ITenantModelStatus {
  id: number;
  status: string;
  search: boolean;
  blood: boolean;
  skill: boolean;
  tenant: string | null;
  tenant_id: string;
  created_at: string;
  updated_at: string;
  sync_at: string;
  files: any | null;
  deleted_at: string | null;
}

export interface IQueryRequest {
  question: string;
}

export interface IQueryResponse {
  answer: string;
}
