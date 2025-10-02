import { Expose } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @Expose({ name: 'user_id' })
  @IsString()
  user_id: string;

  @Expose({ name: 'provider_id' })
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
