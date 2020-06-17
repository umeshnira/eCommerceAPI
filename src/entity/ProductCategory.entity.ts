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

export class ProductCategories {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    category_id: number;

    @Column()
    product_id: number;

    @Column({ type: 'boolean', default: false })
    status: boolean;

    @Column()
    @CreateDateColumn()
    inserted_at: Date;

    @Column()
    @Length(4, 20)
    inserted_by: string;

    @Column()
    @UpdateDateColumn()
    updated_at: Date;

    @Column({nullable: true})
    @Length(4, 100)
    updated_by: string;

}
