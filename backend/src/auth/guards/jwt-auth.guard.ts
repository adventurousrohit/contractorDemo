import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    // canActivate(context: ExecutionContext) {
    //     console.log('Custom Jwt Guard Triggered');
    //     return super.canActivate(context);
    //   }
}
