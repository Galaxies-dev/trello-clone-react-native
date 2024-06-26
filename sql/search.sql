CREATE OR REPLACE FUNCTION public.search_users(search varchar)
RETURNS SETOF users
LANGUAGE plpgsql
AS $$
	begin
		return query
			SELECT *
			FROM users u
			WHERE search % ANY(STRING_TO_ARRAY(u.email, ' '));
	end;
$$;