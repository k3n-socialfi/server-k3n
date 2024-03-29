import { AbstractEntity } from '@common/entities/abstract-entity';
import { Exclude } from 'class-transformer';
import { BeforeInsert, BeforeUpdate, Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity('users')
export class User extends AbstractEntity {
  // @ObjectIdColumn({ name: '_id' })
  // _id: ObjectId;

  @Column({ unique: true })
  userId: string;

  @Column({ unique: true })
  username: string;

  @Column({})
  role: string;

  @Column({ nullable: true, default: null })
  type: string;

  @Column({ nullable: true, default: null })
  jobTitle: string;

  @Column({ nullable: true, default: null })
  organization: string;

  @Column({ nullable: true, default: null })
  pricePerPost: number;

  @Column({ nullable: true, default: null })
  fullName: string;

  @Column({ nullable: true, default: null })
  email: string;
}
