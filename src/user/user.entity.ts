import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}

export default User;