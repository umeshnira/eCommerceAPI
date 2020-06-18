export class ProductModel {

    id: number;
    name: string;
    description: string;
    status: boolean;
    batch_no: number;
    exp_date: Date;
    star_rate: string;
    bar_code: Blob;
    about: Text;
    is_returnable: boolean;
    inserted_by: string;
    inserted_at: Date;
    updated_by: string;
    updated_at: Date;
}
