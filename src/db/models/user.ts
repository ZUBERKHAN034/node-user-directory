export interface IUserModel {
  id?: string;
  email: string;
  password: string;
  client: 'user-client';
  firstName: string;
  lastName: string;
  type: 'GOOGLE' | 'CUSTOM';
  role: 'admin' | 'user' | 'custom';
  createdAt: Date;
  updatedAt: Date;
}
