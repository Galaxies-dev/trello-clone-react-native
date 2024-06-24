import { createContext, useContext } from 'react';
import { client } from '@/utils/supabaseClient';
import { useAuth } from '@clerk/clerk-expo';
export const BOARDS_TABLE = 'boards';
export const USER_BOARDS_TABLE = 'user_boards';
export const LISTS_TABLE = 'lists';
export const CARDS_TABLE = 'cards';
export const USERS_TABLE = 'users';

type ProviderProps = {
  userId: string | null;
  createBoard: (title: string) => Promise<any>;
  getBoards: () => Promise<any>;
};

const SupabaseContext = createContext<Partial<ProviderProps>>({});

export function useSupabase() {
  return useContext(SupabaseContext);
}

export const SupabaseProvider = ({ children }: any) => {
  const { userId } = useAuth();

  const createBoard = async (title: string) => {
    const { data, error } = await client.from(BOARDS_TABLE).insert({ title, creator: userId });
    console.log('data', data);

    if (error) {
      console.error('Error creating board:', error);
    }

    return data;
  };

  const getBoards = async () => {
    const { data, error } = await client.from(BOARDS_TABLE).select('*').eq('creator', userId);

    if (error) {
      console.error('Error getting boards:', error);
    }

    return data;
  };

  const value = {
    userId,
    createBoard,
    getBoards,
  };

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
};
