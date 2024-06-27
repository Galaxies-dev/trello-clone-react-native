-- WORKS!
create policy "Protect storage access" on storage.objects for all  to public  using (
  bucket_id = 'files'
  and (storage.foldername (name))[1]::bigint in (
    select
      get_boards_for_authenticated_user ()
  )
);