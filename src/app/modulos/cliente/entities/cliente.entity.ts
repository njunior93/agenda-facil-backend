import { IsEmail } from "class-validator";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "../../usuario/entities/usuario.entity";
import { Agendamento } from "../../agendamento/entities/agendamento.entity";

@Entity()
export class Cliente {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({type: "varchar", length: 255, nullable: false})
    nome!: string;

    @Column({unique: true, nullable: true})
    @IsEmail()
    email!: string;

    @Column({type: "varchar", length: 10, nullable: true})
    telefone?: string;

    @Column({type: "varchar", length: 11})
    celular!: string;

    @CreateDateColumn()
    createAt?: Date;

    @OneToMany(() => Agendamento, (agendamento) => agendamento.cliente)
    agendamentos!: Agendamento[];

    @ManyToOne(() => Usuario, (usuario) => usuario.clientes)
    @JoinColumn({name: 'user_id'})
    usuario!: Usuario;
}
