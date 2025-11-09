import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SaveData } from "./SaveData"; 

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

  // Relação: Um Jogo (Game) pode ter muitos Saves (SaveData)
  @OneToMany(() => SaveData, (save) => save.game)
  saves: SaveData[];
}