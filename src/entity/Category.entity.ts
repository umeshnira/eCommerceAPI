import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm';
import { Length } from 'class-validator';
import { ProductCategories } from '.';

@Entity()

export class Categories {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(4, 20)
    name: string;

    @Column({nullable: true})
    parent_category_id: number;

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

    @OneToMany(type => ProductCategories, category => category.category)
    category: ProductCategories[]
}
