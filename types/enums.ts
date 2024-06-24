export enum ModalType {
  Login = 'login',
  SignUp = 'signup',
}

export enum AuthStrategy {
  Google = 'oauth_google',
  Microsoft = 'oauth_microsoft',
  Slack = 'oauth_slack',
}

export interface Board {
  id: number;
  creator: string;
  title: string;
  created_at: string;
  background: string;
  last_edit: null;
}
