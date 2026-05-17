import {Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,} from 'typeorm';

@Entity()
export class ResetSenhaToken{
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column({ unique: true })
  token!: string;

  @Column()
  expiresAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
