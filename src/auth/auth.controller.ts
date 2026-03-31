import { Body, Controller, Post } from "@nestjs/common";
import { AuthSerivce } from "./auth.service";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { authLoginDto } from "src/app/shared/dto/authLogin.dto";

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthSerivce) {}

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
  
}