import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Score } from "./Score";

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 1 })
  level: number;

  @Column({ default: 0 })
  expPoints: number;

  @Column({ default: 0 })
  totalScore: number;

  @Column({ default: "Novo Jogador" })
  bio: string;

  @Column({ default: 0 })
  coins: number;

  @Column({ default: 1 })
  avatarIndex: number;

  @Column({ default: 1 })
  colorIndex: number;

  // Relação: Um Jogador (Player) pertence a um Usuário (User)
  @OneToOne(() => User, (user) => user.player)
  @JoinColumn() // Isso cria a coluna 'userId' nesta tabela
  user: User;

  // Relação: Um Jogador (Player) pode ter muitos Scores
  @OneToMany(() => Score, (score) => score.player)
  scores: Score[];
}