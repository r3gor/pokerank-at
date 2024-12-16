
export type User = {
  id?: number,
  oauthId?: string,

  role: string;
  provider: string,
  email: string,
  username: string,

  hashed_password?: string,
  created_at?: any,
  modified_at?: any,
}
