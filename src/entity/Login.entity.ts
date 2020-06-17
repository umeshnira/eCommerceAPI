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
    // tslint:disable-next-line: variable-name
    user_id: number;

    @Column()
    @Length(4, 20)
    // tslint:disable-next-line: variable-name
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
    @CreateDateColumn()
    // tslint:disable-next-line: variable-name
    inserted_at: Date;

    @Column()
    @Length(4, 20)
    // tslint:disable-next-line: variable-name
    inserted_by: string;

    @Column()
    @UpdateDateColumn()
    // tslint:disable-next-line: variable-name
    updated_at: Date;

    @Column({ nullable: true })
    @Length(4, 100)
    // tslint:disable-next-line: variable-name
    updated_by: string;
}
