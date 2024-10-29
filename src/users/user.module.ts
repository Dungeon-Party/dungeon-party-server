import { Module } from '@nestjs/common'
import { PrismaModule } from 'nestjs-prisma'

import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [PrismaModule.forRoot()],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
