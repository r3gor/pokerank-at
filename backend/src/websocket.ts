import { JWTServicePort, UserServicePort } from "@ports/services";
import { Server, Socket } from "socket.io";
import { Pokemon, User } from "./domain";

export class WebSocketApp {
  constructor(
    private userService: UserServicePort,
    private jwtService: JWTServicePort,
  ) {
  };

  setup(io: Server) {

    // Middleware
    io.use(async (socket: Socket, next) => {
      const token = socket.handshake.query.token as string;

      // FIXME: temporal
      if (token == "ADMINTOKEN") {
        const userDB = await this.userService.getAdmin() as User;
        console.log("admin:", userDB);
        socket.data.user = userDB;
        socket.join('admins');
        next();
        return;
      };

      if (!token) {
        return next(new Error('No token provided'));
      }

      const decoded = await this.jwtService.verify(token) as User;
      if (!decoded) {
        return next(new Error('Invalid token'));
      }

      let userDB: User;
      if (decoded.provider == 'self') {
        userDB = await this.userService.getUser(decoded.id!) as User;
      } else {
        userDB = await this.userService.getUserByIdProvider(decoded.oauthId!, decoded.provider) as User;
      }

      socket.data.user = userDB;

      if (decoded.role === 'ad') {
        socket.join('admins');
      } else {
        socket.join('users');
      }

      next();
    });

    io.on('connection', (socket: Socket) => {
      const user = socket.data.user as User;
      console.log(`SOCKET Usuario conectado: ${user.username} (${user.role})`);

      socket.on('addpokemons', (payload: any) => {
        console.log('pokemones', payload);

        const pokemons: Pokemon[] = payload.pokemons.map((p: any) => ({
          id: p.pokemon_id,
          name: p.pokemon_name,
          power: p.pokemon_power,
        }))

        this.userService.AddPokemons(user.id!, pokemons, 1);


        io.to('admins').emit('pokemonssubidos-admin', {
          message: `${user.username} ha subido un nuevo Pokémon`,
          pokemon: payload,
        });
      })

      socket.on('addpokemon', (pokemonData: any[]) => {
        console.log(`${user.username} ha subido pokemones`);
        console.log('pokemon:', pokemonData);


        // Notificar a los admins
        io.to('admins').emit('notificar admin', {
          message: `${user.username} ha subido un nuevo Pokémon`,
          pokemon: pokemonData
        });
      });

      socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${user.username}`);
      });
    });

  }
}
