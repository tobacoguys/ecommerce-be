import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
    USER = 'USER',
    SELLER = 'SELLER',
    ADMIN = 'ADMIN',
  }
  
@Entity('user')
class User {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    email: string;

    @Column({ nullable: true })
    username: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    bio: string;

    @Column({ nullable: true, type: 'date' })
    birthday: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    avatar: string;

    @Column ({ default: false})
    isActive: boolean;

    @Column({ nullable: true })
    otp: string;
  
    @Column({ nullable: true, type: 'timestamp' })
    otpExpiry: Date;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Column({ type: 'boolean', default: false })
    isSellerRequestPending: boolean;
}

export default User;