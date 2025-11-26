import { api } from './api';

export interface BusinessRelationship {
  id: string;
  supplierId: string;
  resellerId?: string;
  status: 'PENDENTE' | 'ATIVO' | 'INATIVO';
  inviteToken?: string;
  createdAt: Date;
  acceptedAt?: Date;
  supplierName?: string;
  resellerName?: string;
}

export interface StockTransfer {
  id: string;
  supplierId: string;
  resellerId: string;
  status: 'ENVIADO' | 'RECEBIDO' | 'DEVOLVIDO' | 'CANCELADO';
  items: TransferItem[];
  notes?: string;
  sentAt: Date;
  receivedAt?: Date;
  totalQuantity: number;
  totalValue: number;
}

export interface TransferItem {
  productId: string;
  quantity: number;
  name: string;
  costPrice: number;
  salePrice: number;
}

export interface ResellerProduct {
  id: string;
  name: string;
  stock: number;
  salePrice: number;
  lastSaleDate?: Date;
  daysSinceLastSale?: number;
}

export interface CreateRelationshipDto {
  resellerIdentifier: string;
}

export interface SendMerchandiseDto {
  resellerId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  notes?: string;
}

export const distributionService = {
  // ==================== TOKEN-BASED INVITATIONS ====================
  
  async generateInviteToken(): Promise<BusinessRelationship> {
    const response = await api.post<BusinessRelationship>('/distribution/invite-token');
    return response.data;
  },

  async acceptByToken(token: string): Promise<BusinessRelationship> {
    const response = await api.post<BusinessRelationship>('/distribution/accept-by-token', { token });
    return response.data;
  },

  // ==================== RELATIONSHIP MANAGEMENT ====================

  async createRelationship(data: CreateRelationshipDto): Promise<BusinessRelationship> {
    const response = await api.post<BusinessRelationship>('/distribution/relationships', data);
    return response.data;
  },

  async acceptRelationship(relationshipId: string): Promise<BusinessRelationship> {
    const response = await api.patch<BusinessRelationship>(`/distribution/relationships/${relationshipId}/accept`);
    return response.data;
  },

  async getPendingRelationships(): Promise<BusinessRelationship[]> {
    const response = await api.get<BusinessRelationship[]>('/distribution/relationships/pending');
    return response.data;
  },

  async getResellers(): Promise<BusinessRelationship[]> {
    const response = await api.get<BusinessRelationship[]>('/distribution/resellers');
    return response.data;
  },

  async getSuppliers(): Promise<BusinessRelationship[]> {
    const response = await api.get<BusinessRelationship[]>('/distribution/suppliers');
    return response.data;
  },

  // ==================== INVENTORY MIRROR ====================

  async getResellerInventory(resellerId: string): Promise<ResellerProduct[]> {
    const response = await api.get<ResellerProduct[]>(`/distribution/resellers/${resellerId}/inventory`);
    return response.data;
  },

  // ==================== MERCHANDISE TRANSFERS ====================

  async sendMerchandise(data: SendMerchandiseDto): Promise<StockTransfer> {
    const response = await api.post<StockTransfer>('/distribution/merchandise/send', data);
    return response.data;
  },

  async acceptMerchandise(transferId: string): Promise<StockTransfer> {
    const response = await api.patch<StockTransfer>(`/distribution/merchandise/${transferId}/accept`);
    return response.data;
  },

  async getTransfers(): Promise<StockTransfer[]> {
    const response = await api.get<StockTransfer[]>('/distribution/transfers');
    return response.data;
  },
};
