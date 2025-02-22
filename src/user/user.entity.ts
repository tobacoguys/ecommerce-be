import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
class User {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    email: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    bio: string;

    @Column({ nullable: true, type: 'date' })
    birthday: string;

    @Column({ nullable: true })
    avatar: string;
}

export default User;