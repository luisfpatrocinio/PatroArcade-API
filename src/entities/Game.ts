import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Score } from "./Score"; 

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("text")
  description: string;

  @Column()
  genre: string;

  @Column("simple-array") // Ótimo para armazenar arrays de strings
  tags: string[];

  @Column("simple-json") // Perfeito para armazenar objetos
  dataLabels: { [key: string]: string };

  @Column({ type: "integer", default: 15000 })
  maxScorePerMinute: number;

  @Column({ type: "integer", default: 5000 })
  baseScoreBuffer: number;

  // Relação: Um Jogo (Game) pode ter muitos Scores
  @OneToMany(() => Score, (score) => score.game)
  scores: Score[];
}