import { CreateDateColumn, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sent_emails')
export class SentEmail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  messageId: string;

  @Column({ type: 'varchar', length: 255 })
  referenceId: string;

  @Column({ type: 'varchar', length: 50 })
  referenceType: string;

  @CreateDateColumn()
  createdAt: Date;
}
