import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  passwordHash: string;

 @Column({ type: 'bigint', nullable: true, unique: true })
telegramId: number | null;

  @Column({ type: 'text', nullable: true })
  accessToken: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
