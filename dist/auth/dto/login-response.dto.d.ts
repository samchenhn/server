import { UserResponseDto } from '../../users/dto/user-response.dto';
export declare class LoginResponseDto {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    user: UserResponseDto;
    constructor(accessToken: string, user: UserResponseDto, expiresIn?: number);
}
