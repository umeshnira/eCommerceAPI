import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { Length } from 'class-validator';
import { UserRole } from './RoleEntity';


@Entity()
@Unique(['username'])

export class LoginEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(4, 20)
    username: string;

    @Column()
    @Length(4, 100)
    password: string;

    @Column({
        type: "enum",
        enum: UserRole,
    })
    role: UserRole;

    @Column({ type: 'boolean', default: false })
    isDeleted: boolean;

    @Column()
    @CreateDateColumn()
    createdDate: Date;

    @Column()
    @Length(4, 20)
    createdBy: string;

    @Column()
    @UpdateDateColumn()
    modifiedDate: Date;

    @Column({ nullable: true })
    @Length(4, 100)
    modifiedBy: string;
}
