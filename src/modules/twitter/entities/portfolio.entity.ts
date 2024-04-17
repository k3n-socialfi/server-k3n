import { AbstractEntity } from '@common/entities/abstract-entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, Unique } from 'typeorm';

@Entity('twitter-portfolio')
@Unique(['userId', 'symbol'])
export class TwitterPortfolio extends AbstractEntity {
  @Column()
  userId: string;

  @Column()
  tokenName: string;

  @Column()
  contractAddress: string;

  @Column()
  symbol: string;

  @Column()
  image: string;

  @Column({ type: 'decimal' })
  shillPrice: number;

  @Column({ type: 'number' })
  firstTweetDate: number;

  @Column()
  firstTweet: string;

  @BeforeInsert()
  async beforeInsert() {
    if (!this.image) this.image = null;
    if (!this.contractAddress) this.contractAddress = null;
  }

  @BeforeUpdate()
  async beforeUpdate() {}
}
