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
      INSERT IGNORE INTO pokemon(name, power)
      VALUES (?,?)
    `;

    const [result] = await this.pool.query(script, [
      p.name, p.power,
    ])

    const { affectedRows, insertId } = result as any;

    return insertId;
  }

  async createPokemonMultiple(values: Pokemon[]) {
    if (values.length == 0) {
      return { affectedRows: 0 };
    }

    const script = `
      INSERT IGNORE INTO pokemon(name, power)
      VALUES ${values.map(() => "(?, ?)").join(", ")}
    `;

    const params: any[] = [];
    values.forEach((item) => {
      params.push(item.name, item.power);
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

    return affectedRows;
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

  async updateStatusUserPokemons(userId: number, pokemonIds: number[], status: string) {
    if (pokemonIds.length == 0) { 
      return 0;
    }

    const script = `
      UPDATE user_pokemon
      SET status = ?
      WHERE user_id = ?
        AND pokemon_id in (${pokemonIds.map(() => '?').join(', ')})
      ; `

    const [result] = await this.pool.execute(
      script, [status, userId, ...pokemonIds],
    );

    const { affectedRows } = result as any;

    return affectedRows;
  }

  async updateStatusPokemons(pokemonIds: number[], status: string) {
    if (pokemonIds.length == 0) { 
      return;
    }

    const script = `
      UPDATE pokemon
      SET status = ?
      WHERE id in (${pokemonIds.map(() => '?').join(', ')})
      ; `

    const [result] = await this.pool.execute(
      script, [status, ...pokemonIds],
    );

    const { affectedRows } = result as any;

    return affectedRows;
  }
}
