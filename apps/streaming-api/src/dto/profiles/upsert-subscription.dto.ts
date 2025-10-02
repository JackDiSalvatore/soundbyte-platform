import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export class UpsertSubscriptionDto {
  @IsEnum(['free', 'pro'])
  plan: 'free' | 'pro';

  @Expose({ name: 'started_at' })
  @IsOptional()
  started_at?: Date;

  @Expose({ name: 'started_at' })
  @IsOptional()
  expires_at?: Date | null;
}
