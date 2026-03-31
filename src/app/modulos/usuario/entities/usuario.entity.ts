import { IsEmail } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: 255})
    nome: string;

    @Column({unique: true})
    @IsEmail()
    email: string;

    @Column({type: "varchar", length: 60, nullable: false})
    senhaHash: string;

    @Column({type: "boolean", default: true})
    ativo: boolean;

    @CreateDateColumn()
    createAt?: Date;
}
