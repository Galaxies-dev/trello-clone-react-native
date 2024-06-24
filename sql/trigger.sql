-- inserts a row into user_boards
create function public.handle_board_added()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.user_boards (board_id, user_id)
  values (new.id, new.creator);
  return new;
end;
$$;

-- trigger the function every time a board is created
create trigger on_board_created
  after insert on boards
  for each row execute procedure public.handle_board_added();