import { UserPokemon } from "./UserPokemon";

// Define la estructura para los Pokemons verificados y no verificados
interface Pokemons {
  verified: UserPokemon[];
  unverified: UserPokemon[];
}

// Define la estructura de una Medalla
interface Medal {
  id: number;
  name: string;
  score: number;
  currentScore: number;
}

// Define las medallas verificadas y no verificadas
interface Medals {
  verified: Medal;
  unverified: Medal;
}

// Define la estructura principal del usuario
export interface UserDashboardModel {
  id: number;
  oauth_id: string;
  provider: string;
  role: string;
  email: string;
  username: string;
  hashed_password: string | null;
  created_at: string; // ISO Date string
  modified_at: string | null; // ISO Date string
  pokemons: Pokemons;
  medals: Medals;
}
