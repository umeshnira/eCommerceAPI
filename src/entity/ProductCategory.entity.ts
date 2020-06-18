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
    OneToMany
} from 'typeorm';
import { Length } from 'class-validator';
import { Categories } from './Category.entity';
import { Products } from './Product.entity';

@Entity()

export class ProductCategories {

    @PrimaryGeneratedColumn()
    id: number;

    // @Column()
    // category_id: number;

    @ManyToOne(type => Categories)
    @JoinColumn({ name: "category_id",referencedColumnName: "id"})
    category: Categories;

    // @Column()
    // product_id: number;

    @OneToOne(type => Products, {eager:true})
    @JoinColumn({ name: "product_id", referencedColumnName: "id"})
    products: Products;

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
