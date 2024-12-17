import { Medal } from "./medal";
import { User } from "./user";
import { UserPokemon } from "./userPokemon";

interface UserDashboardPokemons {
  verified: UserPokemon[];
  unverified: UserPokemon[];
}

interface ScoreMedal extends Medal {
  currentScore: number 
}

interface UserDashboardMedal {
  verified: ScoreMedal;
  unverified: ScoreMedal;
}

export interface UserDashboard extends User{
  pokemons: UserDashboardPokemons;
  medals: UserDashboardMedal;
}
