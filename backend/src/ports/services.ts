import { Pokemon } from "@domain/pokemon";
import { User } from "../domain/user";
import { UserDashboard } from "@domain/userDashboard";

export interface JWTServicePort {
  sign(payload: any): string; 
  verify(token: string): Promise<any>;
}

export interface UserServicePort {
  getUser(id: number): Promise<User | null>;
  getUserByIdProvider(id: string, provider: string): Promise<User | null>;
  createUser(user: User): Promise<number | null>;
  addPokemons(userId: number, pokemons: Pokemon[], medalId: number): Promise<any>;
  getMedalScore(userId: number): Promise<any[]>;
  getAdmin(): Promise<User>;
  getUsers(): Promise<User[]>;
  getUserDashboard(userId: number): Promise<UserDashboard>;
  aprobarPokemons(userId: number, pokemonsId: number[]): Promise<any>;
  rechazarPokemons(userId: number, pokemonsId: number[]): Promise<any>;
}

export interface MedalServicePort {

}
