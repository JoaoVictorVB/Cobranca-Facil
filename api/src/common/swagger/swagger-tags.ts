export const SWAGGER_TAGS = {
  AUTH: 'Auth',
  CLIENTS: 'Clients',
  PRODUCTS: 'Products',
  CATEGORIES: 'Categories',
  TAGS: 'Tags',
  SALES: 'Sales',
  DISTRIBUTION: 'Distribution',
  RISK_ANALYTICS: 'Risk Analytics',
  REPORTS: 'Reports',
} as const;

export type SwaggerTag = (typeof SWAGGER_TAGS)[keyof typeof SWAGGER_TAGS];
