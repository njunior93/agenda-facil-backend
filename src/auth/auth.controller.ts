import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { authLoginDto } from "src/app/shared/dto/authLogin.dto";
import { EsqueciSenhaDto } from "./dto/esqueci-senha.dto";
import { ResetSenhaDto } from "./dto/reset-senha.dto";

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
    @ApiOperation({ summary: 'Login do Usuário' })
    @ApiResponse({
        status: 201,
        description: 'Login realizado com sucesso',
        type: authLoginDto,
      })
    @ApiResponse({
      status: 404,
      description: 'Usuario não encontrado',
    })
    @ApiResponse({
      status: 401,
      description: 'Senha incorreta',
    })
    login(@Body() loginAuthDto: LoginAuthDto) {
      return this.authService.login(loginAuthDto);
    }

  @Post('resetar-senha')
    esqueciMinhaSenha(@Body() esqueciSenhaDto: EsqueciSenhaDto) {
    return this.authService.esqueciMinhaSenha(esqueciSenhaDto);
  }

  @Post('confirmar-reset')
   resetPassword(@Body() resetPasswordDto: ResetSenhaDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}