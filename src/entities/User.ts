import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Player } from "./Player"; 

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // Usuário deve ser único
  username: string;

  @Column({ unique: true }) // Email deve ser único
  email: string;

  @Column()
  password: string; // Hash da senha

  @Column()
  role: "admin" | "player";

  // Novo campo para AdminUser
  @Column("simple-array", { nullable: true })
  arcades: number[] | null;

  // Relação: Um Usuário (User) tem um Jogador (Player)
  @OneToOne(() => Player, (player) => player.user, {
    cascade: true, // Se um User for criado, um Player também será (útil)
  })
  player: Player;
}