import { User } from "@domain/user"
import { UserRepoPort } from "@ports/repository"
import mysql from 'mysql2/promise';

export class UserRepo implements UserRepoPort {
  constructor(
    private pool: mysql.Pool
  ){}

  async createUser(user: User): Promise<number> {
    const script = `
      INSERT IGNORE INTO user (email, oauth_id, provider, username, hashed_password)
      VALUES (?, ?, ?, ?, ?);
    `;
    const [result] = await this.pool.query(script, [
      user.email, user.oauthId, user.provider, user.username, user.hashed_password
    ]);

    const { affectedRows, insertId } = result as any;

    return insertId;
  }

  async getUserById(id: number): Promise<User | null> {
    const script = `
      SELECT * FROM user
      WHERE id = ?;
    `;
    const [rows] = await this.pool.query(script, [id]);

    if ((rows as any).length === 0) {
      return null;  // No se encontró el usuario
    }

    const row = (rows as User[])[0];

    return row;
  }

  async getUserByOAuthId(id: string, provider: string): Promise<User | null> {
    const script = `
      SELECT * FROM user
      WHERE oauth_id = ? and provider = ?;
    `;
    const [rows] = await this.pool.query(script, [id, provider]);

    if ((rows as any).length === 0) {
      return null;  // No se encontró el usuario
    }

    const row = (rows as User[])[0];

    return row;
  }

  async getUserPokemons(id: number): Promise<any | null> {
    const script = `
      SELECT * FROM user_pokemon
      WHERE user_id = ?;
    `;
    const [rows] = await this.pool.query(script, [id]);

    return rows;
  }

  async getAdmin(): Promise<User> {
    const script = `
      SELECT * FROM user
      WHERE role = ?;
    `;
    const [rows] = await this.pool.query(script, ['ad']);

    const row = (rows as User[])[0];

    return row;
  }
}
