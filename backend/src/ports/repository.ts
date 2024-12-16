import { Medal } from "@domain/medal";
import { Pokemon } from "@domain/pokemon";
import { User } from "@domain/user";

export interface UserRepoPort {
  getUserById(id: number): Promise<User | null>;
  createUser(user: User): Promise<number | null>;
  getUserByOAuthId(id: string, provider: string): Promise<User | null>;
  getUserPokemons(userId: number): Promise<any[]>;
  getAdmin(): Promise<User>;
};

export interface PokemonRepoPort {
  createPokemon(p: Pokemon): Promise<number | null>;
  createPokemonMultiple(values: Pokemon[]): Promise<{ affectedRows: number }>;
  assignPokemon(userId: number, pokemonId: number, medalId: number): Promise<number | null>;
  assignPokemonMultiple(
    userId: number, 
    values: { pokemonId: number; medalId: number }[]
  ): Promise<{ affectedRows: number }>;
  getPokemonsByName(names: string[]): Promise<Pokemon[]>;
};

export interface MedalRepoPort {
  getMedals(): Promise<Medal[]>;
}
