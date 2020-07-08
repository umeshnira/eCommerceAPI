import { Length, IsNotEmpty, MaxLength,IsNumber,IsDate } from 'class-validator';
import { IsNotBlank } from '../../validators';

export class UpdateOrderLocationDTO{


    @IsNotEmpty()
    @Length(1, 50)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    name: string;

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    address: string;

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    lanmark: string;
    
    @IsNotEmpty()
    @Length(1, 10)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    pincode: string;

    @IsNotEmpty()
    @Length(1, 50)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    email: string;

    @IsNotEmpty()
    @Length(1, 20)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    phone: string;

    @IsNotEmpty()
    location_date: Date;

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    created_by: string;

}