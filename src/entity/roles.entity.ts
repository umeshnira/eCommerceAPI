import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    OneToOne,
    JoinColumn
} from 'typeorm';
import { Length } from 'class-validator';
import { Categories,Products,Login } from '.';

@Entity()
@Unique(['description'])

export class Roles {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(4, 45)
    name: string;

    @Column()
    @Length(4, 100)
    description: string;

    @Column()
    @CreateDateColumn({type: "timestamp"})
    created_at: Date;

    @Column(({ nullable: true }))
    @Length(4, 20)
    created_by: string;

    @OneToMany(type => Login, Login => Login.roles)
    roles: Login[]

}
