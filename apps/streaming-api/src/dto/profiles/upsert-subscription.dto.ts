import { IsEnum, IsOptional } from 'class-validator';

export class UpsertSubscriptionDto {
  @IsEnum(['free', 'pro'])
  plan: 'free' | 'pro';

  @IsOptional()
  started_at?: Date;

  @IsOptional()
  expires_at?: Date | null;
}
