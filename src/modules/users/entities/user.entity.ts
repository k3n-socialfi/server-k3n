import { AbstractEntity } from '@common/entities/abstract-entity';
import { Column, Entity, ObjectIdColumn } from 'typeorm';


export class BlockchainWallet {
    chainId: string;
    address: string;
}

export class SocialNetwork {
    social: string;
    username: string;
}
@Entity('users')
export class User extends AbstractEntity {
    @ObjectIdColumn({ name: '_id' })
    userId: string;

    @Column({ unique: true })
    username: string;

    @Column({})
    role: string;

    @Column({ default: '' })
    fullName: string;

    @Column({ default: '' })
    email: string;

    @Column({ default: '' })
    phoneNumber: number;

    @Column()
    password: string;

    @Column({ type: "jsonb", default: [] })
    wallets: BlockchainWallet;

    @Column({ type: "jsonb", default: [] })
    socialProfiles: SocialNetwork;

    @Column({ default: '' })
    avatar: string;

    @Column({ default: '' })
    bio: string;

    @Column({ default: '' })
    coverImage: string;

    @Column({ default: '' })
    dob: string;

    @Column({ default: '' })
    gender: string;

    @Column({ default: '' })
    country: string;

    @Column({ default: '' })
    verificationStatus: boolean;

    @Column({ default: '' })
    referralCode: string;

    @Column({ default: '' })
    lastLogin: string;

}