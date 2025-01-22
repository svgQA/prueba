// Definimos la estructura de los datos de "User"

export interface User {
  id: number;
  name: string;
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
