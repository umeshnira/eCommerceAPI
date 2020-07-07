import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    ManyToOne,
    OneToMany,
    Timestamp
} from 'typeorm';
import { Length } from 'class-validator';
import { Products } from './product.entity';
import { Clients } from './client.entity';

@Entity()

export class Carts {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Clients, { nullable: false })
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    clients: number;

    @OneToOne(type => Products, { nullable: false })
    @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
    products: number;


    @Column({ nullable: true })
    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @Column({ nullable: true })
    @Length(4, 100)
    created_by: string;

    @Column({ nullable: true })
    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @Column({ nullable: true })
    @Length(4, 100)
    updated_by: string;

}
