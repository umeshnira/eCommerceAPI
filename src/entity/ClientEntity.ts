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
@Unique(['username'])

export class ClientEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(4, 20)
    username: string;

    @Column()
    @Length(4, 100)
    password: string;

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
