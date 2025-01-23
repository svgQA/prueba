// Definimos la estructura de los datos de "User"

import { IconParams } from 'node_modules/react-toastify/dist/components';

export interface User {
  id: number;
  name: string;
  notificar: string;
  identification: string;
  email: string;
  company: string;
  department: string;
  connection: 'Activo' | 'Inactivo';
  taskProgress: number; // 0 - 100 (por ejemplo)

  // Campos extras que irán en el expansible
  address: string;
  phone: string;
  age: number;
  experience: number;
}
