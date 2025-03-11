import { Module } from '@nestjs/common';
import { DatabaseModule } from './core/database/database.module';
// import { ProfilesModule } from './features/profiles/profile.module';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';
import { AuthGuard } from './features/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'shared';

@Module({
  imports: [
    DatabaseModule,
    // ProfilesModule,
    AuthModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {
  constructor() {
    const secret = env.JWT_SECRET;
    console.log("JWT secret key: ", secret);
    if (!secret) {
      throw new Error("JWT_SECRET is not set in the environment variables!");
    }
  }
}
