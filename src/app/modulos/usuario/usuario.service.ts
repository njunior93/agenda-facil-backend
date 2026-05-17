import { ConflictException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuarioService {
  constructor(@InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>) {}


  async create(createUsuarioDto: CreateUsuarioDto) {
    const passwordHash = await bcrypt.hash(createUsuarioDto.senha, 10);

    try{
      const usuario = {
        nome: createUsuarioDto.nome,
        email: createUsuarioDto.email,
        senhaHash: passwordHash,
        ativo: true
      }

      const novoUsuario = this.usuarioRepository.create(usuario);
      return await this.usuarioRepository.save(novoUsuario);
    } catch (error: any) {
        if(error.code === '23505') {
            throw new ConflictException('Email já cadastrado');
        }
    
        if (error instanceof HttpException) {
            throw error;
        }
    
        throw new InternalServerErrorException('Erro ao salvar usuário');
    }
  }

  findAll() {
    return `This action returns all usuario`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
