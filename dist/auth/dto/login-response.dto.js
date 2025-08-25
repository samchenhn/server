"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginResponseDto = void 0;
class LoginResponseDto {
    accessToken;
    tokenType;
    expiresIn;
    user;
    constructor(accessToken, user, expiresIn = 3600) {
        this.accessToken = accessToken;
        this.tokenType = 'Bearer';
        this.expiresIn = expiresIn;
        this.user = user;
    }
}
exports.LoginResponseDto = LoginResponseDto;
//# sourceMappingURL=login-response.dto.js.map