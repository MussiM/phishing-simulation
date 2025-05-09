import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn, ObjectId } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Email {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  subject: string;

  @Column()
  content: string;

  @Column()
  senderId: string;

  @Column()
  recipient: string;

  @Column()
  sentAt: Date;

  @Column({ default: 'pending' })
  deliveryStatus: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 