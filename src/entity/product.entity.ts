import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    OneToOne

} from 'typeorm';
import { Length } from 'class-validator';
import { ProductImages, ProductQuantity, ProductOffers, ProductPrices } from '.';

@Entity()

export class Products {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(4, 20)
    name: string;

    @Column()
    @Length(4, 100)
    description: string;

    @Column({ type: 'boolean', default: false })
    status: boolean;

    @Column()
    batch_no: number;

    @Column()
    @CreateDateColumn({type: "timestamp"})
    exp_date: Date;

    @Column()
    @Length(4, 20)
    star_rate: string;

    @Column("text")
    bar_code: string;

    @Column("text")
    about: string;

    @Column({ type: 'boolean', default: true })
    is_returnable: boolean;

    @Column()
    @Length(4, 20)
    inserted_by: string;

    @Column()
    @CreateDateColumn({type: "timestamp"})
    inserted_at: Date;

    @Column({nullable: true})
    @UpdateDateColumn({type: "timestamp"})
    updated_at: Date;

    @Column({ nullable: true })
    @Length(4, 100)
    updated_by: string;

    @OneToMany(type => ProductImages, image => image.products)
    image: ProductImages[]

    @OneToOne(type => ProductQuantity, quantity => quantity.products)
    quantity: ProductQuantity[]

    @OneToOne(type => ProductOffers, offers => offers.products)
    offers: ProductOffers[]

    @OneToOne(type => ProductPrices, price => price.products)
    price: ProductPrices[]
}
