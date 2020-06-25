import { ProductOffers } from "../entity";

export class ProductOffersModel {

    id: number;
    product_id: number;
    offer_id: number;
    inserted_at: Date;
    inserted_by: string;
    updated_at: Date;
    updated_by: string;

    getMappedEntity(model: this) {
        const entity = new ProductOffers()
        entity.offer_id = model?.offer_id;
        entity.inserted_at = model?.inserted_at;
        entity.inserted_by = model?.inserted_by;
        entity.updated_at = model?.updated_at;
        entity.updated_by = model?.updated_by;

        return entity;
    }
}

