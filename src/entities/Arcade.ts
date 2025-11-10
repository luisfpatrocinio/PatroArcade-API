import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Arcade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("text")
  description: string;
}