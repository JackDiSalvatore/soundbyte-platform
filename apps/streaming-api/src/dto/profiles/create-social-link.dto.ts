import { IsInt, IsString, IsUrl } from 'class-validator';

export class CreateSocialLinkDto {
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
