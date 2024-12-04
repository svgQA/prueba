interface IWarning {
  additional_properties: object;
  key: string;
  message: string;
  name: string;
  details: string;
  documentation_link: string;
}

interface IExecutionResult {
  additional_properties: {
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
    '@odata.context': string;
  };
  status: string;
  last_result: IExecutionResult;
  execution_history: IExecutionResult[];
  limits: ILimits;
}
