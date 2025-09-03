export interface ICreateWebhookRequest {
  name: string;
  webhook: string;
  // events: string[];
  platform: string;
  token: string;
}
