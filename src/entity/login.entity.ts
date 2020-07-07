import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Length } from 'class-validator';
import { UserRole } from '../enums';
import { Status,Roles } from '.';


@Entity()
@Unique(['user_name'])

export class Login {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    @Length(4, 20)
    user_name: string;

    @Column()
    @Length(4, 100)
    password: string;

    @ManyToOne(type => Status,{ nullable: true } )
    @JoinColumn({ name: 'status', referencedColumnName: 'id'})
    status: number;

    @ManyToOne(type => Roles,{ nullable: true } )
    @JoinColumn({ name: 'role', referencedColumnName: 'id'})
    roles: number;

    @Column()
    @CreateDateColumn({type: 'timestamp'})
    created_at: Date;

    @Column()
    @Length(4, 20)
    created_by: string;

    @Column({nullable: true})
    @UpdateDateColumn({type: 'timestamp'})
    updated_at: Date;

    @Column({ nullable: true })
    @Length(4, 100)
    updated_by: string;
}
