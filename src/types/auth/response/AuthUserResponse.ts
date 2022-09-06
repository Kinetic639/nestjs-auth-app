import { UserFiltered } from '../../user';

export type AuthUserResponse = {
  error: string | null;
  status: string | null;
  user: UserFiltered | null;
};
