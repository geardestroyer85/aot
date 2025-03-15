import { CanActivate, ExecutionContext, Injectable, SetMetadata, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { TokenPayload } from "./auth.type";
import { UserRole } from "shared";


export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const IS_USER_KEY = 'isUser';
export const User = () => SetMetadata(IS_USER_KEY, true);

export const IS_STAFF_KEY = 'isStaff';
export const Staff = () => SetMetadata(IS_STAFF_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookies(request);
    
    if (!token) {
      throw new UnauthorizedException('No access token');
    }

    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token);
      request['user'] = payload;

      const isUser = this.reflector.getAllAndOverride<boolean>(IS_USER_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      const isStaff = this.reflector.getAllAndOverride<boolean>(IS_STAFF_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (isStaff && payload.role === UserRole.USER) {
        return false;
      }
      if (isUser && payload.role === UserRole.USER) {
        return true;
      }
      
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromCookies(request: any): string {
    return request?.cookies?.access_token ?? '';
  }
}