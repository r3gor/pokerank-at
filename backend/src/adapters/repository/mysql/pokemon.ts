import { Pokemon } from '@domain/pokemon';
import { PokemonRepoPort } from '@ports/repository';
import mysql from 'mysql2/promise';

// TODO: Implement logging, error handling

export class PokemonRepo implements PokemonRepoPort {
  constructor(
    private pool: mysql.Pool,
  ) {}

  async createPokemon(p: Pokemon) {
    const script = `
      INSERT IGNORE INTO pokemon(id, name, power)
      VALUES (?,?,?)
    `;

    const [result] = await this.pool.query(script, [
      p.id, p.name, p.power,
    ])

    const { affectedRows, insertId } = result as any;

    return insertId;
  }

  async createPokemonMultiple(values: Pokemon[]) {
    if (values.length == 0) {
      return { affectedRows: 0 };
    }

    const script = `
      INSERT IGNORE INTO pokemon(id, name, power)
      VALUES ${values.map(() => "(?, ?, ?)").join(", ")}
    `;

    const params: any[] = [];
    values.forEach((item) => {
      params.push(item.id, item.name, item.power);
    });

    const [result] = await this.pool.execute(script, params);

    const { affectedRows } = result as any;

    return { affectedRows };
  }

  async assignPokemon(userId: number, pokemonId: number, medalId: number) {
    const script = `
      INSERT IGNORE INTO user_pokemon(user_id, pokemon_id, medal_id)
      VALUES (?,?,?);
    `;

    const [result] = await this.pool.query(script, [
      userId, pokemonId, medalId
    ])

    const { affectedRows, insertId } = result as any;

    return insertId;
  }

  async assignPokemonMultiple(userId: number, values: {pokemonId: number, medalId: number}[]) {

    if (values.length == 0) {
      return { affectedRows: 0 };
    }

    const script = `
      INSERT IGNORE INTO user_pokemon (user_id, pokemon_id, medal_id)
      VALUES ${values.map(() => "(?, ?, ?)").join(", ")}
    `;

    const params: any[] = [];
    values.forEach((item) => {
      params.push(userId, item.pokemonId, item.medalId);
    });

    const [result] = await this.pool.execute(script, params);

    const { affectedRows } = result as any;

    return { affectedRows };
  }

  async getPokemonsByName(names: string[]) {

    if (names.length == 0) {
      return [];
    }

    const script = `SELECT id, name FROM pokemon WHERE name IN (${names.map(() => '?').join(', ')})`
    const [rows] = await this.pool.execute(
      script, names
    );

    return rows as Pokemon[];
  }
}
