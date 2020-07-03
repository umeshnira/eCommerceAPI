import { SaveLater } from "../entity";

export class SaveLaterModel {

    id: number;
    product_id: number;
    client_id: number;
    created_at: Date;
    created_by: string;
    updated_at: Date;
    updated_by: string;

    getMappedEntity(model: this) {
        const entity = new SaveLater()
        entity.clients = model?.client_id;
        entity.created_at = model?.created_at;
        entity.created_by = model?.created_by;
        entity.updated_at = model?.updated_at;
        entity.updated_by = model?.updated_by;
        entity.products = model?.product_id;
        return entity;
    }
}

