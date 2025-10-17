export interface IWebhookResponse {
  id: number;
  name: string;
  url: string;
  events: string[];
  platform: string;
  token: string;
}
