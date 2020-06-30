import { Carts } from "../entity";

export class CartsModel {

    id: number;
    product_id: number;
    client_id: number;
    inserted_at: Date;
    inserted_by: string;
    updated_at: Date;
    updated_by: string;

    getMappedEntity(model: this) {
        const entity = new Carts()
        entity.client_id = model?.client_id;
        entity.inserted_at = model?.inserted_at;
        entity.inserted_by = model?.inserted_by;
        entity.updated_at = model?.updated_at;
        entity.updated_by = model?.updated_by;
        entity.product_id = model?.product_id;
        return entity;
    }
}

