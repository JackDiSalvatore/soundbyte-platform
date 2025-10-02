import { IsInt, IsString, IsUrl } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export class CreateSocialLinkDto {
  @Expose({ name: 'profile_id' })
  @Transform(({ value }) => Number(value))
  @IsInt()
  profile_id: number;

  @IsString()
  platform:
    | 'facebook'
    | 'twitter'
    | 'tiktok'
    | 'instagram'
    | 'youtube'
    | 'bandcamp'
    | 'spotify';

  @IsUrl()
  url: string;
}
