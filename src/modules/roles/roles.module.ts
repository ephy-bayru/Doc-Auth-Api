import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([]), forwardRef(() => UsersModule)],
  providers: [],
  exports: [TypeOrmModule],
})
export class RolesModule {}
