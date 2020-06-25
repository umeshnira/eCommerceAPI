import { ProductPrices } from "../entity";

export class ProductPricesModel {

    id: number;
    product_id: number;
    price: number;
    price_without_offer:number;
    inserted_at: Date;
    inserted_by: string;
    updated_at: Date;
    updated_by: string;

    getMappedEntity(model: this) {
        const entity = new ProductPrices()
        entity.price = model?.price;
        entity.price_without_offer = model?.price_without_offer;
        entity.inserted_at = model?.inserted_at;
        entity.inserted_by = model?.inserted_by;
        entity.updated_at = model?.updated_at;
        entity.updated_by = model?.updated_by;

        return entity;
    }
}

