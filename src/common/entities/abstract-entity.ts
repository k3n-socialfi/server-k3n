import { ObjectIdColumn, ObjectId, Column, BeforeInsert, BeforeUpdate } from 'typeorm';

import { getCurrentInSeconds } from 'src/utils/helper';

export abstract class AbstractEntity {
  @ObjectIdColumn()
  public _id: ObjectId;

  @Column({ type: 'number' })
  public createdAt: number;

  @Column({ type: 'number' })
  public updatedAt: number;

  @Column({ type: 'boolean' })
  public isDeleted: boolean;

  @BeforeInsert()
  insertDefault() {
    this.createdAt = getCurrentInSeconds();
    this.updatedAt = getCurrentInSeconds();
    this.isDeleted = false;
  }

  @BeforeUpdate()
  updateDates() {
    this.updatedAt = getCurrentInSeconds();
  }
}
