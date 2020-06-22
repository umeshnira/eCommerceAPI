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
import { Categories } from './category.entity';
import { Products } from './product.entity';

@Entity()

export class ProductCategories {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Categories, {nullable: false})
    @JoinColumn({ name: "category_id",referencedColumnName: "id"})
    category: Categories;

    @OneToOne(type => Products, {nullable: false})
    @JoinColumn({ name: "product_id", referencedColumnName: "id"})
    products: Products;

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

    @Column({nullable: true})
    @Length(4, 100)
    updated_by: string;

}
