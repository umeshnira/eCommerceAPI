import { Categories } from "../entity";

export class CategoryModel {

    id: number;
    name: string;
    status: boolean;
    parent_category_id: number;
    inserted_by: string;
    updated_by: string;

    getMappedEntity(model: this) {
        const entity = new Categories()
        entity.name = model?.name;
        entity.parent_category_id = model?.parent_category_id;
        entity.inserted_by = model?.inserted_by;

        return entity;
    }
}

