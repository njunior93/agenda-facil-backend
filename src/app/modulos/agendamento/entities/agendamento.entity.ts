import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "../../usuario/entities/usuario.entity";
import { Cliente } from "../../cliente/entities/cliente.entity";

@Entity()
export class Agendamento {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({type: "varchar", length: 255, nullable: false})
    tipoServico!: string;

    @Column({type: "varchar", length: 255, nullable: false})
    servico!: string;

    @Column({type: "date", nullable: false})
    data!: string;

    @Column({type: "time", nullable: false})
    hora!: string;

    @CreateDateColumn()
    createAt?: Date;

    @ManyToOne(() => Cliente, (cliente) => cliente.agendamentos)
    @JoinColumn({name: 'cliente_id'})
    cliente!: Cliente;

    @ManyToOne(() => Usuario, (usuario) => usuario.agendamentos)
    @JoinColumn({name: 'user_id'})
    usuario!: Usuario;
}
