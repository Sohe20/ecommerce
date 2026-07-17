import { Module } from '@nestjs/common';
import { UsersModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports:[UsersModule,
        JwtModule.register({
      secret: 'your-secret-key-here', // بعداً از env بخون
      signOptions: { expiresIn: '1d' },
    }),
    ],
    providers:[AuthService]
})
export class AuthModule {}
