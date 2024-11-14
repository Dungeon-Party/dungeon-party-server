/* eslint-disable */
export default async () => {
    const t = {
        ["./api-key/entities/api-key.entity"]: await import("./api-key/entities/api-key.entity"),
        ["./user/entities/user.entity"]: await import("./user/entities/user.entity"),
        ["./auth/dto/token-response.dto"]: await import("./auth/dto/token-response.dto")
    };
    return { "@nestjs/swagger": { "models": [[import("./user/entities/user.entity"), { "UserEntity": { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, email: { required: true, type: () => String }, username: { required: true, type: () => String }, password: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./api-key/entities/api-key.entity"), { "ApiKeyEntity": { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, key: { required: true, type: () => String }, userId: { required: true, type: () => Number }, expiresAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./api-key/dto/create-apiKey.dto"), { "CreateApiKeyDto": { name: { required: true, type: () => String } } }], [import("./user/dto/create-user.dto"), { "CreateUserDto": {} }], [import("./user/dto/update-user.dto"), { "UpdateUserDto": {} }], [import("./auth/dto/jwt-payload.dto"), { "JwtPayloadDto": { sub: { required: true, type: () => Number }, iss: { required: true, type: () => String }, username: { required: true, type: () => String }, email: { required: true, type: () => String }, iat: { required: true, type: () => Number }, exp: { required: true, type: () => Number } } }], [import("./auth/dto/token-response.dto"), { "TokenResponseDto": { accessToken: { required: true, type: () => String }, refreshToken: { required: true, type: () => String } } }], [import("./auth/dto/login.dto"), { "LoginDto": { username: { required: true, type: () => String }, password: { required: true, type: () => String } } }]], "controllers": [[import("./api-key/api-key.controller"), { "ApiKeyController": { "create": { type: t["./api-key/entities/api-key.entity"].ApiKeyEntity }, "delete": { type: t["./api-key/entities/api-key.entity"].ApiKeyEntity } } }], [import("./user/user.controller"), { "UserController": { "getUsers": { type: [t["./user/entities/user.entity"].UserEntity] }, "updateUser": { type: t["./user/entities/user.entity"].UserEntity } } }], [import("./auth/auth.controller"), { "AuthController": { "login": { type: t["./auth/dto/token-response.dto"].default }, "refresh": { type: t["./auth/dto/token-response.dto"].default }, "getProfile": { type: t["./user/entities/user.entity"].UserEntity } } }], [import("./health/health.controller"), { "HealthController": { "check": { type: Object } } }]] } };
};