import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseSeedService } from './database-seed.service';
import { Role, RoleSchema } from './entities/role.entity';
import { User, UserSchema } from '../users/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest-users', {
      // 连接选项
      retryWrites: true,
      w: 'majority',
    }),
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [DatabaseSeedService],
  exports: [MongooseModule, DatabaseSeedService],
})
export class DatabaseModule {}
