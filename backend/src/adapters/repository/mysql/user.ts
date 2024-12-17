import { User } from "@domain/user"
import { UserPokemon } from "@domain/userPokemon";
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

  async getUserPokemons(id: number): Promise<UserPokemon[]> {
    const script = `
        SELECT
            up.user_id, up.pokemon_id, up.status as capture_status,
            p.name, p.power, p.status as pokemon_status
        from user_pokemon up
        left join pokemon p on up.pokemon_id = p.id
        where up.user_id = ?;
    `;
    const [rows] = await this.pool.query(script, [id]);

    return rows as UserPokemon[];
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

  async getUsers(): Promise<User[]> {
    const script = `
      SELECT * FROM user
      WHERE role = ?;
    `;

    const [rows] = await this.pool.query(script, ['us']);

    return rows as User[];
  }
}
