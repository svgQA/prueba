/**
 * Estructura de los datos de Correspondencia:
 * - id: identificador único
 * - sender: Remitente
 * - owner: Propietario (quien recibe la correspondencia)
 * - receivedAt: Hora recibido
 * - houseNumber: Casa/Apto
 * - status: Estado (Entregado, En Portería, etc.)
 * - whoPickedUp: Quién recibe/retira la correspondencia
 *
 * En el expansible:
 * - packageType: Tipo de paquete (texto)
 * - observation: Observación libre del paquete
 * - messageToOwner: Mensaje para el propietario
 */
export interface ICorrespondence {
  id: number;
  sender: string; // Remitente
  owner: string; // Propietario
  receivedAt: string; // "YYYY-MM-DDTHH:mm:ss" o similar
  houseNumber: string; // "Casa 101", "Apto 302", ...
  status: CorrespondenceStatus;
  whoPickedUp: string;

  // Para el expansible
  packageType: string; // "Documentos", "Revista", etc.
  observation: string; // Observaciones libres
  messageToOwner: string; // Mensaje que queremos enviar al propietario
}

export enum Correspondence_status {
  Delivered = 'Entregado',
  InReception = 'En Portería',
}