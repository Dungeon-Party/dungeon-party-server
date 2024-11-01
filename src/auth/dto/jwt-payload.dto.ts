import { Exclude, Expose } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export default class JwtPayloadDto {
  @Expose()
  get id(): number {
    return this.sub
  }

  @IsNotEmpty()
  @IsNumber()
  @Exclude()
  sub: number

  @IsNotEmpty()
  @IsString()
  @Exclude()
  iss: string

  @IsNotEmpty()
  @IsString()
  username: string

  @IsNotEmpty()
  @IsString()
  email: string

  @IsNotEmpty()
  @IsNumber()
  @Exclude()
  iat: number

  @IsNotEmpty()
  @IsNumber()
  @Exclude()
  exp: number

  constructor(partial: Partial<JwtPayloadDto>) {
    Object.assign(this, partial)
  }
}
