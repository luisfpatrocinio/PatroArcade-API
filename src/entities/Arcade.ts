import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Score } from "./Score";

@Entity()
export class Arcade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("text")
  description: string;

  @Column({ type: "integer", nullable: true })
  ownerId: number | null;

  @Column({ type: "varchar", default: "offline" })
  status: "online" | "offline";

  @Column({ nullable: true, type: "datetime" })
  lastBootTime: Date | null;

  @Column({ type: "integer", nullable: true })
  currentGameId: number | null;

  // Relação: Um Arcade pode ter muitos Scores
  @OneToMany(() => Score, (score) => score.arcade)
  scores: Score[];
}