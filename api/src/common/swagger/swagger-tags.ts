export const SWAGGER_TAGS = {
  AUTH: 'Auth',
  CLIENTS: 'Clients',
  PRODUCTS: 'Products',
  SALES: 'Sales',
  REPORTS: 'Reports',
} as const;

export type SwaggerTag = (typeof SWAGGER_TAGS)[keyof typeof SWAGGER_TAGS];
