import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Player } from "./Player";
import { Game } from "./Game";

@Entity()
export class SaveData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "Jogando..." })
  richPresenceText: string;

  @UpdateDateColumn() // O TypeORM atualiza isso automaticamente
  lastPlayed: Date;

  @Column("simple-json") // Armazena o objeto { highestScore: 500, ... }
  data: { [key: string]: number };

  // Relação: Muitos Saves (SaveData) pertencem a Um Jogador (Player)
  @ManyToOne(() => Player, (player) => player.saves)
  player: Player;

  // Relação: Muitos Saves (SaveData) pertencem a Um Jogo (Game)
  @ManyToOne(() => Game, (game) => game.saves)
  game: Game;
}