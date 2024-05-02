import "dotenv/config"
import { env } from 'process';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './modules/users/entities/user.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: env.DATABASE_URL,
      entities: [User],
      synchronize: true
    }),
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource){}
}
