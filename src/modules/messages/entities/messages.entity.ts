import { AbstractEntity } from '@common/entities/abstract-entity';
import { BeforeInsert, Column, Entity } from 'typeorm';

// export enum JobState {
//   Pending = 'Pending',
//   Progress = 'Progress',
//   Completed = 'Completed'
// }
@Entity('messages')
export class Messages extends AbstractEntity {
  @Column({ unique: true })
  messageId: string;

  @Column({ nullable: false })
  requestType: string;

  @Column({ nullable: false })
  message: string;

  @Column({ nullable: false })
  from: string;

  @Column({ nullable: false })
  to: string;

  @Column({ nullable: true })
  reply: string;

  @Column({ nullable: true, default: null })
  amount: number;

}
