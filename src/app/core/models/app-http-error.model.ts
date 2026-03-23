export interface AppHttpError {

  status: number;

  title?: string;

  detail?: string;

  validationErrors?: Record<string, string[]>;

  isConcurrencyError?: boolean;

  isUnauthorized?: boolean;

  isForbidden?: boolean;
}
