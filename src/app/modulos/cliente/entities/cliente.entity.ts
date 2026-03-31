import { PrimaryGeneratedColumn } from "typeorm";

export class Cliente {
    @PrimaryGeneratedColumn()
    id: number;
}
