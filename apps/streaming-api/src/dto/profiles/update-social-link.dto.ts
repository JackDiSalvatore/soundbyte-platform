import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateSocialLinkDto {
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
