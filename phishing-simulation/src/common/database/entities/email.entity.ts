import { UUID } from 'crypto';
import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn, ObjectId } from 'typeorm';

@Entity()
export class Email {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  senderId: string;

  @Column()
  recipient: string;

  @Column({ nullable: true })
  sentAt: Date;

  @Column({ default: 'pending' })
  deliveryStatus: string;

  @Column({ default: 0 })
  clicks: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 