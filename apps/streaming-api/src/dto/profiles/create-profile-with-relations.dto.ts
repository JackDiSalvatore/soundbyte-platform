import { CreateSubscriptionDto } from '../../services/profiles/subscriptions.service';
import { CreateProfileDto } from './create-profile.dto';
import { CreateSocialLinkDto } from './create-social-link.dto';

export type CreateProfileWithRelationsDto = {
  profile: CreateProfileDto;
  subscription?: Omit<CreateSubscriptionDto, 'profileId'>;
  genres?: number[]; // array of genreIds
  socials?: Omit<CreateSocialLinkDto, 'profileId'>[];
};
