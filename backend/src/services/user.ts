
import { UserServicePort } from '@ports/services';
import { MedalRepoPort, PokemonRepoPort, UserRepoPort } from '../ports/repository';
import { User } from '@domain/user';
import { Pokemon } from '@domain/pokemon';
import { UserDashboard } from '@domain/userDashboard';

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

    // console.log("medals", medals);
    // console.log("userpokemons", userpokemons);

    const missingScore = medals.map(m => ({
      name: m.name, 
      score: m.score,
      missingScore: Math.max(m.score - pokemonsLength, 0),
    }))

    console.log("missing", missingScore);

    return missingScore;
  }

  async getUserDashboard(userId: number) {
    const user = await this.userRepo.getUserById(userId);
    const pokemons = await this.userRepo.getUserPokemons(userId);
    const medals = await this.medalRepo.getMedals(); 

    const verifiedPokemons = pokemons.filter(p => p.capture_status == 'acep');
    const unverifiedPokemons = pokemons.filter(p => p.capture_status == 'pend');

    const verifiedPokemonsLen = verifiedPokemons.length;
    const unverifiedPokemonsLen = unverifiedPokemons.length;
    const uploadedPokemonsLen = verifiedPokemonsLen + unverifiedPokemonsLen;
    const verifiedMedal = medals.slice().reverse().find(m => m.score <= verifiedPokemonsLen);
    const unverifiedMedal = medals.find(m => m.score >= uploadedPokemonsLen && m.id != verifiedMedal?.id);

    const res: UserDashboard = {
      ...user!,
      pokemons: {
        verified: verifiedPokemons,
        unverified: pokemons.filter(p => p.capture_status == 'pend'),
      },
      medals: {
        verified: { ...verifiedMedal!, currentScore: verifiedPokemonsLen },
        unverified: { ...unverifiedMedal!, currentScore: uploadedPokemonsLen },
      }
    };

    return res;
  };

  async getUser(id: number) {
    return this.userRepo.getUserById(id);
  };

  async getUserByIdProvider(id: string, provider: string): Promise<User | null> {
      return this.userRepo.getUserByOAuthId(id, provider);
  }

  async getUsers() {
    return this.userRepo.getUsers();
  }

  async createUser(user: User) {
    return this.userRepo.createUser(user);
  };

  async addPokemons(userId: number, pokemons: Pokemon[], medalId: number) {
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

  async aprobarPokemons(userId: number, pokemonsId: number[]) {
    await Promise.all([
      this.pokemonRepo.updateStatusUserPokemons(userId, pokemonsId, 'acep'),
      this.pokemonRepo.updateStatusPokemons(pokemonsId, 'acep'),
    ]);
  }

  async rechazarPokemons(userId: number, pokemonsId: number[]) {
    await Promise.all([
      this.pokemonRepo.updateStatusUserPokemons(userId, pokemonsId, 'dene'),
    ]);
  }

  getAdmin(): Promise<User> {
      return this.userRepo.getAdmin();
  }
}
