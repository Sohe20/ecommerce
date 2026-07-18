import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import userRoleEnum from './enum/userRoleEnum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const alreadyUser = await this.findOneByMobile(createUserDto.mobile, true);
    if (alreadyUser)
      throw new BadRequestException(
        'کاربری با این شماره موبایل در سیستم ثبت شده ',
      );

    const newUser = this.userRepository.create(createUserDto);

    return await this.userRepository.save(newUser);
  }

  async findAll(role?: userRoleEnum, limit: number = 10, page: number = 1) {
    const query = this.userRepository.createQueryBuilder('users');

    if (role) {
      query.where('role = :x', { x: role });
    }

    // paginition
    query.skip((page - 1) * limit).take(limit);

    return await query.getMany();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException(`کاربر ${id} پیدا نشد`);

    return user;
  }

  async findOneByMobile(mobile: string, checkExist: boolean = false) {
    const user = await this.userRepository.findOneBy({ mobile });

    if (!user && !checkExist)
      throw new NotFoundException(`کاربر ${mobile} پیدا نشد`);

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    try {
      const updateUser = await this.userRepository.update(id, updateUserDto);
      return await this.findOne(id);
    } catch (error) {
      throw new BadRequestException('هنگام ویرایش کاربر خطایی رخ داد');
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete({ id });

    if (result.affected === 0)
      throw new NotFoundException(`Project ${id} is not found!`);
  }
}
