import { Pokemon } from "@domain/pokemon"
import { User } from "@domain/user";
import { UserServicePort } from "@ports/services"
import { Server, Socket } from "socket.io";

export default class UserWSController {

  constructor(
    private userService: UserServicePort,
    private io: Server,
  ) {}

  registerEvents(socket: Socket) {
    socket.on("add-pokemons", (p) => this.addPokemons(socket.data, p))
  }

  addPokemons = async (socketData: any, payload: {
    pokemon_id: number,
    pokemon_name: string,
    pokemon_power: string,
  }[]) => {

    const pokemons: Pokemon[] = payload.map((p: any) => ({
      // id: p.pokemon_id,
      name: p.pokemon_name,
      power: p.pokemon_power,
    }))

    const user = socketData.user as User;

    await this.userService.addPokemons(user.id!, pokemons, 1);

    const userDashbUpdated = await this.userService.getUserDashboard(user.id!);
    const users = await this.userService.getUsers();
    const adminDashUpdated = await Promise.all(users.map(u => this.userService.getUserDashboard(u.id!)));

    this.io.to('admins').emit('dashboard-update', adminDashUpdated);

    this.io.to(`user-${user.id}`).emit('dashboard-update', userDashbUpdated);

  }

}
