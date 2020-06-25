
export class CategoryListModel {

    id: number;
    name: string;
    parent_category_id: number;
    inserted_by: string;
    inserted_at: string;
    subCategories: CategoryListModel[] = [];

    constructor(id: number, name: string, inserted_at: string, inserted_by: string, parent_category_id?: number,) {
        this.id = id;
        this.name = name;
        this.inserted_by = inserted_by;
        this.inserted_at = inserted_at;
        this.parent_category_id = parent_category_id;
    }
}
