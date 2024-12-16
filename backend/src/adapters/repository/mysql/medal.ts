import { Medal } from '@domain/medal';
import { MedalRepoPort } from '@ports/repository';
import mysql from 'mysql2/promise';

export class MedalRepo implements MedalRepoPort {
  constructor(
    private pool: mysql.Pool,
  ) {}

  async getMedals() {
    const script = `
      SELECT * from medal ORDER BY score;
    `;

    const [result] = await this.pool.query(script, [])

    return result as Medal[];
  };
};
