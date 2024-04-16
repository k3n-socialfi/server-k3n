import { AbstractEntity } from '@common/entities/abstract-entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

@Entity('twitter-portfolio')
export class TwitterPortfolio extends AbstractEntity {
  @Column({ unique: true })
  userId: string;

  @Column({ unique: true })
  username: string;

  @Column()
  tokenName: string;

  @Column()
  contractAddress: string;

  @Column()
  symbol: string;

  @Column({ type: 'decimal' })
  shillPrice: number;

  @Column({ type: 'number' })
  firstTweetDate: number;

  @Column()
  firstTweet: string;

  @BeforeInsert()
  async beforeInsert() {}

  @BeforeUpdate()
  async beforeUpdate() {}
}
