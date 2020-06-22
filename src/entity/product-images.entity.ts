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

@Entity()

export class ProductImages {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Products, {nullable: false})
    @JoinColumn({ name: "product_id", referencedColumnName: "id"})
    products: Products;


    @Column({ type: 'text' })
    image: string;

    @Column({nullable: true})
    @CreateDateColumn({type: "timestamp"})
    inserted_at: Date;

    @Column({nullable: true})
    @Length(4, 100)
    inserted_by: string;

    @Column({nullable: true})
    @UpdateDateColumn({type: "timestamp"})
    updated_at: Date;

    @Column({nullable: true})
    @Length(4, 100)
    updated_by: string;

}
