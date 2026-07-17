import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bycrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import userRoleEnum from 'src/user/enum/userRoleEnum';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    mobile: string,
    password: string,
    display_name: string,
  ): Promise<User> {
    const hashedPassword = await bycrypt.hash(password, 10);

    return this.userService.create({
      mobile,
      password: hashedPassword,
      display_name,
      role: userRoleEnum.NormalUser,
    });
  }

  async login(mobile: string, password: string) {
    const user: User = await this.userService.findOneByMobile(mobile);

    if (!(await bycrypt.compare(password, user.password)))
      throw new UnauthorizedException('رمز شما اشتباه هست');


    const payload = {mobile : user.mobile , sub : user.id , display_name:user.display_name}
  }


}
