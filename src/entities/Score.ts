import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Player } from "./Player";
import { Game } from "./Game";
import { Arcade } from "./Arcade";

@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  score: number;

  @Column({ default: 0 })
  sessionTimeInSeconds: number;

  @Column({ type: "varchar", length: 150, nullable: true })
  richPresenceText: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relação: Muitos Scores pertencem a Um Jogador
  @ManyToOne(() => Player, (player) => player.scores, { onDelete: "CASCADE" })
  player: Player;

  // Relação: Muitos Scores pertencem a Um Jogo
  @ManyToOne(() => Game, (game) => game.scores, { onDelete: "CASCADE" })
  game: Game;

  // Relação: Muitos Scores pertencem a Um Arcade (nullable para retrocompatibilidade)
  @ManyToOne(() => Arcade, (arcade) => arcade.scores, { nullable: true, onDelete: "SET NULL" })
  arcade: Arcade | null;
}
