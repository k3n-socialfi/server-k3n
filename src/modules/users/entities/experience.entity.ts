import { AbstractEntity } from '@common/entities/abstract-entity';
import { BadRequestException } from '@nestjs/common';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

@Entity('experiences')
export class UserExperiences extends AbstractEntity {
  @Column({ unique: true })
  userExperienceId: string;

  @Column({ unique: true })
  userId: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true, default: null })
  employmentType: string;

  @Column({ nullable: false })
  companyName: string;

  @Column({ nullable: true, default: null })
  location: string;

  @Column({ nullable: true, default: null })
  locationType: string;

  @Column({ nullable: true, default: null })
  currentlyWorking: boolean;

  @Column({ nullable: false })
  startDate: number;

  @Column({ nullable: true, default: null })
  endDate: number;

  @Column({ nullable: true, default: null })
  industry: string;

  @Column({ nullable: true, default: null })
  description: string;

  @Column({ nullable: true, default: null })
  media: string;

  @Column({ nullable: true, default: null })
  projectName: string;

  @Column({ nullable: true, default: null })
  skill: string[];

  @BeforeInsert()
  async beforeInsert() {
    if (!this.employmentType) this.employmentType = null;
    if (!this.location) this.location = null;
    if (!this.locationType) this.locationType = null;
    if (!this.currentlyWorking) this.currentlyWorking = null;
    if (!this.endDate) this.endDate = null;
    if (!this.industry) this.industry = null;
    if (!this.description) this.description = null;
    if (!this.media) this.media = null;
    if (!this.description) this.description = null;
    if (!this.skill) this.skill = [];
    if (!this.currentlyWorking && !this.endDate) throw new BadRequestException('End date is required');
  }
  @BeforeUpdate()
  async beforeUpdate() {
    if (!this.currentlyWorking && !this.endDate) throw new BadRequestException('End date is required');
    if (this.currentlyWorking) this.endDate = null;
  }
}
