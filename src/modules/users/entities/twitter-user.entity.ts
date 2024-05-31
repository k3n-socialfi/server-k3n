import { AbstractEntity } from '@common/entities/abstract-entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

@Entity('twitter-users')
export class TwitterUsers extends AbstractEntity {
  @Column({ unique: true })
  userId: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true, default: null })
  fullName: string;

  @Column({ nullable: true, default: 0 })
  twitterPoints: number;

  @Column({ nullable: true, default: 0 })
  royaltyPoints: number;

  @Column({ nullable: true, default: 0 })
  totalPoints: number;

  @Column({ nullable: true, default: 0 })
  previousRank: number;

  @Column({ nullable: true, default: 0 })
  previous7DRank: number;

  @Column({ nullable: true, default: 0 })
  previous30DRank: number;

  @Column({ nullable: true, default: null })
  avatar: string;

  @Column({ nullable: true, default: null })
  coverImage: string;

  @Column({ nullable: true, default: null })
  verificationStatus: boolean;

  @Column({ nullable: true, default: null })
  followers: number;

  @Column({ nullable: true, default: null })
  following: number;

  @Column({ nullable: true, default: null })
  externalUrl: string;

  @Column({ nullable: true, default: null })
  numberOfTweets: number;

  @Column({ nullable: true, default: null })
  creationDate: string;

  @BeforeInsert()
  async beforeInsert() {
    if (!this.twitterPoints) this.twitterPoints = 0;
    if (!this.royaltyPoints) this.royaltyPoints = 0;
    this.totalPoints = this.twitterPoints + this.royaltyPoints;
  }
  @BeforeUpdate()
  async beforeUpdate() {
    this.totalPoints = this.twitterPoints + this.royaltyPoints;
  }
}
