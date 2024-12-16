import { Pokemon } from "@domain/pokemon";
import { User } from "../domain/user";

export interface JWTServicePort {
  sign(payload: any): string; 
  verify(token: string): Promise<any>;
}

export interface UserServicePort {
  getUser(id: number): Promise<User | null>;
  getUserByIdProvider(id: string, provider: string): Promise<User | null>;
  createUser(user: User): Promise<number | null>;
  AddPokemons(userId: number, pokemons: Pokemon[], medalId: number): void;
  getMedalScore(userId: number): Promise<any[]>;
  getAdmin(): Promise<User>;
}

export interface MedalServicePort {

}
