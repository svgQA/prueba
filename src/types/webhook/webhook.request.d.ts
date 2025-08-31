export interface ICreateWebhookRequest {
  name: string;
  url: string;
  events: string[];
  platform: string;
  token: string;
}
