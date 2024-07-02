export enum ModalType {
  Login = 'login',
  SignUp = 'signup',
}

export enum AuthStrategy {
  Google = 'oauth_google',
  Microsoft = 'oauth_microsoft',
  Slack = 'oauth_slack',
  Apple = 'oauth_apple',
}

export interface Board {
  id: string;
  creator: string;
  title: string;
  created_at: string;
  background: string;
  last_edit: null;
}

export interface TaskList {
  board_id: string;
  created_at: string;
  id: string;
  position: number;
  title: string;
}

export interface TaskListFake {
  id?: string;
}

export interface Task {
  id: string;
  list_id: number;
  board_id: number;
  position: number;
  title: string;
  description: string | null;
  assigned_to: string | null;
  done: boolean;
  image_url?: string;
  created_at: string;
  users?: User;
}

export interface User {
  avatar_url: string;
  email: string;
  first_name: string;
  id: string;
  username: null;
}
