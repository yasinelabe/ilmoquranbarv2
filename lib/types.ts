export interface AuthPayload extends Record<string, unknown> {
  id: number;
  username: string;
  fullname: string;
  iat?: number;
  exp?: number;
}