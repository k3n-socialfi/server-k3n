import { AbstractEntity } from '@common/entities/abstract-entity';
import { Exclude } from 'class-transformer';
import { BeforeInsert, BeforeUpdate, Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

export class BlockchainWallet {
  chainId: number;
  address: string;
}

export class SocialNetwork {
  social: string;
  username: string;
}

export enum UserType {
  Caller = 'Caller',
  Influencer = 'Influencer',
  Researcher = 'Researcher',
  Threador = 'Threador',
  Celebrities = 'Celebrities',
  Experts = 'Experts',
  KOL = 'KOL',
  Founder = 'Founder & Builder',
  Media = 'New & Media',
  Agencies = 'Agencies',
  Other = 'Other'
}

export enum UserTags {
  NFT = 'NFT',
  DeFi = 'DeFi',
  NFTfi = 'NFTfi',
  GameFi = 'GameFi',
  DAO = 'DAO',
  Infrastructure = 'Infrastructure',
  Stablecoin = 'Stablecoin',
  Automation = 'Automation',
  MemeCoin = 'MemeCoin',
  GambleFi = 'GambleFi',
  Tool = 'Tool',
  SocialFi = 'SocialFi',
  AI = 'AI',
  Inscription = 'Inscription',
  Ordinals = 'Ordinals',
  RWA = 'RWA',
  ERC404 = 'ERC404',
  Other = 'Other'
}

export enum JobTittle {
  BlockchainDeveloper = 'Blockchain Developer',
  FrontEndDeveloper = 'FrontEnd Developer',
  BackendDeveloper = 'Backend Developer',
  Freelance = 'Freelance',
  FullStackDeveloper = 'FullStack Developer',
  DataEngineer = 'Data Engineer',
  KOLs = 'KOLs',
  ProducerManager = 'Producer Manager',
  CEO = 'CEO',
  CMO = 'CMO',
  CoFounder = 'Co-Founder',
  MarketingManager = 'Marketing Manager',
  Marketing = 'Marketing',
  CommunityManage = 'Community Manager'
}

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

  @Column({})
  isProjectAccount: boolean;

  @Column({ nullable: true, default: null })
  type: string;

  @Column({ nullable: true, default: null })
  jobTitle: string;

  @Column({ nullable: true, default: null })
  organization: string;

  @Column({ nullable: true, default: [] })
  experience: any[];

  @Column({ nullable: true, default: null })
  pricePerPost: number;

  @Column({ nullable: true, default: null })
  fullName: string;

  @Column({ nullable: true, default: null })
  email: string;

  @Column({ nullable: true, default: null })
  phoneNumber: number;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true, default: [] })
  wallets: BlockchainWallet[];

  @Column({ nullable: true, default: [] })
  socialProfiles: SocialNetwork[];

  @Column({ nullable: true, default: [] })
  tags: UserTags[];

  @Column({ nullable: true })
  jobTittle: JobTittle;

  @Column({ nullable: true })
  review: number;

  // @Column({ nullable: true, default: 0 })
  // twitterPoints: number;

  // @Column({ nullable: true, default: 0 })
  // royaltyPoints: number;

  // @Column({ nullable: true, default: 0 })
  // totalPoints: number;

  // @Column({ nullable: true, default: null })
  // avatar: string;

  @Column({ nullable: true, default: null })
  bio: string;

  // @Column({ nullable: true, default: null })
  // coverImage: string;

  @Column({ nullable: true, default: null })
  dob: string;

  @Column({ nullable: true, default: null })
  gender: string;

  @Column({ nullable: true, default: null })
  location: string;

  // @Column({ nullable: true, default: null })
  // verificationStatus: boolean;

  @Column({ nullable: true, default: null })
  referralCode: string;

  @Column({ nullable: true, default: null })
  lastLogin: string;

  @Column({ nullable: true, default: null })
  twitterInfo: any;

  @Column({ nullable: false })
  isUpdated: boolean;

  // for project
  @Column({ nullable: true, default: null })
  projectChain?: string;

  @Column({ nullable: true, default: null })
  projectName?: string;

  @Column({ nullable: true, default: null })
  tokenName?: string;

  @Column({ nullable: true, default: null })
  platform?: string;

  @BeforeInsert()
  async beforeInsert() {
    if (!this.type) this.type = null;
    if (!this.jobTitle) this.jobTitle = null;
    if (!this.organization) this.organization = null;
    // if (!this.experience) this.experience = [];
    if (!this.fullName) this.fullName = null;
    if (!this.email) this.email = null;
    if (!this.phoneNumber) this.phoneNumber = null;
    if (!this.wallets) this.wallets = [];
    if (!this.socialProfiles) this.socialProfiles = [];
    // if (!this.twitterPoints) this.twitterPoints = 0;
    // if (!this.royaltyPoints) this.royaltyPoints = 0;
    // if (!this.avatar) this.avatar = null;
    if (!this.bio) this.bio = null;
    // if (!this.coverImage) this.coverImage = null;
    if (!this.dob) this.dob = null;
    if (!this.gender) this.gender = null;
    if (!this.location) this.location = null;
    // if (!this.verificationStatus) this.verificationStatus = null;
    if (!this.referralCode) this.referralCode = null;
    if (!this.lastLogin) this.lastLogin = null;
    if (!this.isUpdated) this.isUpdated = false;
    // this.totalPoints = this.twitterPoints + this.royaltyPoints;
    // this.userId = this._id.toString();

    if (!this.projectChain) this.projectChain = null;
    if (!this.projectName) this.projectName = null;
    if (!this.platform) this.platform = null;
  }

  // @BeforeUpdate()
  // async beforeUpdate() {
  // if (!this.fullName) this.fullName = null;
  // if (!thi
  // if (!this.phoneNumber) this.phoneNumber = null;
  // if (!this.wallets) this.wallets = [];
  // if (!this.socialProfiles) this.socialProfiles = [];
  // if (!this.twitterPoints) this.twitterPoints = 0;
  // if (!this.royaltyPoints) this.royaltyPoints = 0;
  // if (!this.avatar) this.avatar = null;
  // if (!this.bio) this.bio = null;
  // if (!this.coverImage) this.coverImage = null;
  // if (!this.dob) this.dob = null;
  // if (!this.gender) this.gender = null;
  // if (!this.location) this.location = null;
  // if (!this.verificationStatus) this.verificationStatus = null;
  // if (!this.referralCode) this.referralCode = null;
  // if (!this.lastLogin) this.lastLogin = null;
  //   this.totalPoints = this.twitterPoints + this.royaltyPoints;
  // }
}
