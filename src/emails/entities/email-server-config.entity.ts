import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('emailServerConfigs')
export class EmailServerConfig {
  @PrimaryGeneratedColumn('uuid')
  emailServerConfigId: string;

  @Column({ type: 'varchar', length: 36, unique: true })
  subscriptionDetailId: string;

  @Column({ type: 'varchar', length: 255 })
  host: string;

  @Column({ type: 'int' })
  port: number;

  @Column({ type: 'boolean', default: false })
  secure: boolean;

  @Column({ type: 'boolean', default: true })
  requireTLS: boolean;

  @Column({ type: 'varchar', length: 255 })
  user: string;

  @Column({ type: 'text' })
  pass: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fromEmail: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fromName: string;

  @Column({ type: 'text', nullable: true })
  logoUrl: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
