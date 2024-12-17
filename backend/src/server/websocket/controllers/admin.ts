import { User } from "@domain/user";
import { UserPokemon } from "@domain/userPokemon";
import { UserServicePort } from "@ports/services";
import { Server, Socket } from "socket.io";

export class AdminWSController {
  constructor(
    private userService: UserServicePort,
    private io: Server,
  ) {}

  registerEvents(socket: Socket) {
    socket.on("admin-check-pokemons", (p) => this.checkPokemons(socket.data, p));
  }

  checkPokemons = async (socketData: any, payload: {
    pokemons: UserPokemon[],
    action: "rechazo" | "aprobacion",
  }) => {
    const admin = socketData.user as User;

    if (payload?.pokemons.length == 0 || admin.role != 'ad') { // FIXME: role harcode
      return;
    }
    
    const userId = payload.pokemons[0].user_id;
    const pokemonIds = payload.pokemons.map(p => p.pokemon_id);

    if (payload.action == "aprobacion") {
      await this.userService.aprobarPokemons(userId, pokemonIds);
    }

    if (payload.action == "rechazo") {
      await this.userService.rechazarPokemons(userId, pokemonIds);
    }

    const userDashbUpdated = await this.userService.getUserDashboard(userId);
    const users = await this.userService.getUsers();
    const adminDashUpdated = await Promise.all(users.map(u => this.userService.getUserDashboard(u.id!)));

    this.io.to('admins').emit('dashboard-update', adminDashUpdated);

    this.io.to(`user-${userId}`).emit('dashboard-update', userDashbUpdated);
  }
}
