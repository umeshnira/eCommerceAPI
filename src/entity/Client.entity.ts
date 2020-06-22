import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { Length } from 'class-validator';

@Entity()
@Unique(['email'])

export class Clients {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(4, 20)
    name: string;

    @Column()
    @Length(4, 100)
    address: string;

    @Column()
    @Length(4, 100)
    landmark: string;

    @Column()
    @Length(4, 20)
    pin_code: string;

    @Column()
    @Length(4, 20)
    email: string;

    @Column()
    @Length(4, 20)
    phone: string;

    @Column({ type: 'boolean', default: false })
    status: boolean;

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

