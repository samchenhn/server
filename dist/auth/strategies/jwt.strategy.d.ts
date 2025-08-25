import { Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
export interface JwtPayload {
    username: string;
    sub: string;
    iat?: number;
    exp?: number;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly usersService;
    constructor(usersService: UsersService);
    validate(payload: JwtPayload): Promise<import("../../users/dto/user-response.dto").UserResponseDto>;
}
export {};
