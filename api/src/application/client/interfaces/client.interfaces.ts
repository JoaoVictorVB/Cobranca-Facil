export interface CreateClientData {
  name: string;
  phone?: string;
  referredBy?: string;
  observation?: string;
  address?: string;
}

export interface UpdateClientData {
  name?: string;
  phone?: string;
  referredBy?: string;
  observation?: string;
  address?: string;
}
