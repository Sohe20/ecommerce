import { Module } from '@nestjs/common';
import { UsersModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './stratgeies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule , ConfigService} from '@nestjs/config';
import { AuthController } from './auth.controller';

@Module({
    imports:[UsersModule,
      PassportModule,
      JwtModule.registerAsync({
       imports:[ConfigModule],
       inject:[ConfigService],
       useFactory:async(configService:ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
       })
    }),
    ],
    controllers:[AuthController],
    providers:[AuthService,JwtStrategy]
})
export class AuthModule {}
