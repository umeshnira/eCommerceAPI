import { IsNotEmpty, MaxLength, Length } from 'class-validator';
import { IsNotBlank } from '../../validators';

export class ClientDTO {
    @IsNotEmpty()
    @MaxLength(50)
    @IsNotBlank({ message: 'Value cannot contain empty spaces' })
    name: string;

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({ message: 'Value cannot contain empty spaces' })
    address: string;

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({ message: 'Value cannot contain empty spaces' })
    landmark: string;

    @IsNotEmpty()
    @Length(1, 10)
    @IsNotBlank({ message: 'Value cannot contain empty spaces' })
    pin_code: string;

    @IsNotEmpty()
    @Length(1, 50)
    @IsNotBlank({ message: 'Value cannot contain empty spaces' })
    email: string;

    @IsNotEmpty()
    @Length(1, 20)
    @IsNotBlank({ message: 'Value cannot contain empty spaces' })
    phone: string;
}