import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  userId: string;

  @IsString()
  providerId: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsBoolean()
  verified?: boolean;

  @IsOptional()
  @IsBoolean()
  public?: boolean;
}
