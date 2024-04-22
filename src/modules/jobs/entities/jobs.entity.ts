import { AbstractEntity } from '@common/entities/abstract-entity';
import { BeforeInsert, Column, Entity } from 'typeorm';

@Entity('jobs')
export class Jobs extends AbstractEntity {
  @Column({ unique: true })
  jobId: string;

  @Column({ nullable: false })
  projectName: string;

  @Column({ nullable: true, default: [] })
  tags: string[];

  @Column({ nullable: true, default: null })
  jobType: string;

  @Column({ nullable: true, default: true })
  isPublic: boolean;

  @Column({ nullable: true, default: null })
  jobDescription: string;

  @Column({ nullable: true, default: [] })
  organization: string[];

  @Column({ nullable: true, default: null })
  image: string;

  @Column({ nullable: false })
  creator: string;

  @Column({ nullable: true, default: null })
  completed: number;

  @Column({ nullable: true, default: null })
  review: number;

  @Column({ nullable: true, default: null })
  rating: number;

  @Column({ nullable: true, default: null })
  price: number;

  @Column({ nullable: true, default: null })
  paymentMethod: string;

  @Column({ nullable: true, default: null })
  platform: string;

  @Column({ nullable: true, default: [] })
  currency: string[];

  @BeforeInsert()
  async beforeInsert() {
    if (!this.tags) this.tags = [];
    if (!this.jobType) this.jobType = null;
    if (!this.isPublic) this.isPublic = true;
    if (!this.jobDescription) this.jobDescription = null;
    if (!this.organization) this.organization = [];
    if (!this.image) this.image = null;

    if (!this.completed) this.completed = 0;
    if (!this.review) this.review = 0;
    if (!this.rating) this.rating = 4;
    if (!this.paymentMethod) this.paymentMethod = null;
  }
}
