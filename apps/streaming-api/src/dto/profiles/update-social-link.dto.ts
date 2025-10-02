import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export class UpdateSocialLinkDto {
  @Expose({ name: 'profile_id' })
  @Transform(({ value }) => Number(value))
  @IsInt()
  profile_id: number;

  @IsOptional()
  @IsString()
  platform?:
    | 'facebook'
    | 'twitter'
    | 'tiktok'
    | 'instagram'
    | 'youtube'
    | 'bandcamp'
    | 'spotify';

  @IsOptional()
  @IsUrl()
  url?: string;
}
