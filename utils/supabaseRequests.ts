import { client } from './supabaseClient';

export const createBoard = async (title: string, userId?: string | null) => {
  const { data, error } = await client.from('boards').insert([{ title, owner_id: userId }]);

  if (error) {
    console.error('Error creating board:', error);
  }

  return data;
};

export const getBoards = async () => {
  const userObject = await client.auth.getUser();
  const { data, error } = await client
    .from('boards')
    .select('*')
    .eq('owner_id', userObject.data.user?.id);

  if (error) {
    console.error('Error getting boards:', error);
  }

  return data;
};
