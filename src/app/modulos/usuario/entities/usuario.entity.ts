import { IsEmail } from "class-validator";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UUID } from "typeorm/driver/mongodb/bson.typings.js";
import { Cliente } from "../../cliente/entities/cliente.entity";

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({type: "varchar", length: 255})
    nome!: string;

    @Column({unique: true})
    @IsEmail()
    email!: string;

    @Column({type: "varchar", length: 60, nullable: false})
    senhaHash!: string;

    @Column({type: "boolean", default: true})
    ativo!: boolean;

    @OneToMany(() => Cliente, (cliente) => cliente.usuario)
    clientes!: Cliente[];

    @CreateDateColumn()
    createAt?: Date;
}
