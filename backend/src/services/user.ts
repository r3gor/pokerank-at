
import { UserServicePort } from '@ports/services';
import { MedalRepoPort, PokemonRepoPort, UserRepoPort } from '../ports/repository';
import { User } from '@domain/user';
import { Pokemon } from '@domain/pokemon';

export class UserService implements UserServicePort {
  constructor(
    private userRepo: UserRepoPort,
    private pokemonRepo: PokemonRepoPort,
    private medalRepo: MedalRepoPort,
  ) { }

  async getMedalScore(userId: number) {
    const medals = await this.medalRepo.getMedals(); 
    const userpokemons = await this.userRepo.getUserPokemons(userId);
    const pokemonsLength = userpokemons.length;

    console.log("medals", medals);
    console.log("userpokemons", userpokemons);

    const missingScore = medals.map(m => ({
      name: m.name, 
      score: m.score,
      missingScore: Math.max(m.score - pokemonsLength, 0),
    }))

    console.log("missing", missingScore);

    return missingScore;
  }

  async getUser(id: number) {
    return this.userRepo.getUserById(id);
  };

  async getUserByIdProvider(id: string, provider: string): Promise<User | null> {
      return this.userRepo.getUserByOAuthId(id, provider);
  }

  async createUser(user: User) {
    return this.userRepo.createUser(user);
  };

  async AddPokemons(userId: number, pokemons: Pokemon[], medalId: number) {
    const existingPokemons = await this.pokemonRepo.getPokemonsByName(pokemons.map(p => p.name));
    const newPokemons = pokemons.filter(
      p => !existingPokemons.map(p => p.name).includes(p.name)
    ) 

    await this.pokemonRepo.createPokemonMultiple(newPokemons);
    const createdPokemons = await this.pokemonRepo.getPokemonsByName(newPokemons.map(p => p.name));

    await this.pokemonRepo.assignPokemonMultiple(
      userId,
      [...existingPokemons, ...createdPokemons].map(p => ({ pokemonId: p.id!, medalId }))
    );
  };

  getAdmin(): Promise<User> {
      return this.userRepo.getAdmin();
  }
}
