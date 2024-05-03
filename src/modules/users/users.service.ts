import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const findUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (findUser) {
      throw new ConflictException('User already exists!');
    }
    const user = this.userRepository.create(createUserDto);
    if (user) {
      await this.userRepository.save(user);
    }
    return plainToInstance(User, user);
  }

  async findAll() {
    const users = await this.userRepository.find();
    return plainToInstance(User, users);
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return plainToInstance(User, user);
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email: email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const findUserEmail = await this.userRepository.findOneBy({
      email: updateUserDto.email,
    });
    if (findUserEmail && updateUserDto.email !== user.email) {
      throw new ConflictException('User already exists!');
    }

    const updatedUserData = await this.userRepository.create({
      ...user,
      ...updateUserDto,
    });
    const updatedUser = await this.userRepository.save(updatedUserData);
    return plainToInstance(User, updatedUser);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.delete(user.id);
    return;
  }
}
