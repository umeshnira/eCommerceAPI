export class ProductModel {

    id: number;
    name: string;
    description: string;
    status: boolean;
    batch_no: number;
    exp_date: string;
    star_rate: string;
    bar_code: Blob;
    about: string;
    is_returnable: boolean;
    inserted_by: string;
    updated_by: string;
}
