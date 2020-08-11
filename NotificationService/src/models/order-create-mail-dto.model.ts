import { Length, IsNotEmpty, MaxLength, IsNumber, IsDate } from 'class-validator';
import { IsNotBlank } from '../validators';

export class OrderCreateMailModel{

    @IsNotEmpty()
    @IsNotBlank({ message: 'Value cannot contain empty spaces' })
    toMail: string;

    @IsNotEmpty()
    @IsNotBlank({ message: 'Value cannot contain empty spaces' })
    subject: string;

    @IsNotEmpty()
    @IsNotBlank({ message: 'Value cannot contain empty spaces' })
    body: string;
}