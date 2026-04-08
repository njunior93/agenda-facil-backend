import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}
  
  @UseGuards(AuthTokenGuard)
  @Post('/gravar-cliente')
  create(@Body() createClienteDto: CreateClienteDto, @Req() request:Request) {
    const payload = request['usuario']
    return this.clienteService.create(createClienteDto, payload);
  }

  @UseGuards(AuthTokenGuard)
  @Get('/listar-clientes')
  findAll(@Req() request:Request) {
    const payload = request['usuario']
    return this.clienteService.findAll(payload);
  }

  @UseGuards(AuthTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clienteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clienteService.update(+id, updateClienteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clienteService.remove(+id);
  }
}
