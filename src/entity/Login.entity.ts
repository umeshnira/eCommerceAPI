import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { Length } from 'class-validator';
import { UserRole } from './Role.entity';


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

    @Column({
        type: "enum",
        enum: UserRole,
    })
    role: UserRole;

    @Column({ type: 'boolean', default: false })
    status  : boolean;

    @Column()
    @CreateDateColumn({type: "timestamp"})
    inserted_at: Date;

    @Column()
    @Length(4, 20)
    inserted_by: string;

    @Column({nullable: true})
    @UpdateDateColumn({type: "timestamp"})
    updated_at: Date;

    @Column({ nullable: true })
    @Length(4, 100)
    updated_by: string;
}
