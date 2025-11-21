export type BetaFormData = {
  name: string;
  email: string;
  company: string;
  role: string;
  teamSize: string;
  phone: string;
  message: string;
};

export class BetaService {
  static async request(model: BetaFormData) {
    const url = 'https://flow.tryvoo.com/webhook/create-contact';
    const user = 'n8n.inndico';
    const pass = 'Axd1234*';
    const auth = 'Basic ' + btoa(`${user}:${pass}`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: auth,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(model),
      });

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}
