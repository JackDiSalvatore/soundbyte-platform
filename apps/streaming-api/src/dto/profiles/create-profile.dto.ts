import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  user_id: string;

  @IsString()
  provider_id: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsBoolean()
  verified?: boolean;

  @IsOptional()
  @IsBoolean()
  public?: boolean;
}
