import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import jwtConfig from '../config/jwt.config';
import * as config from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    @Inject(jwtConfig.KEY) private readonly jwtConfiguration: config.ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService 
   )
  {}
  canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extracaoToken(request);

    if(!token){
      throw new UnauthorizedException('Token de autenticação não fornecido');
    }

    try {
       this.jwtService.verifyAsync(token, this.jwtConfiguration);
    } catch (error) {
      throw new UnauthorizedException('Token de autenticação inválido');
    }
    
    return true;
    
  }

  extracaoToken(request: Request): string | null | undefined {
    const authorization = request.headers?.authorization;

    if(!authorization || typeof authorization !== 'string'){
      return;
    }

    return authorization.split(' ')[1];
  }
}
