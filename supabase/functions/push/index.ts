import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

interface Notification {
  id: string;
  user_id: string;
  body: string;
  card_id: string;
}

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: Notification;
  schema: 'public';
  old_record: null | Notification;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req) => {
  const payload: WebhookPayload = await req.json();
  console.log('🚀 ~ Deno.serve ~ payload:', payload);

  console.log('get notification');

  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', payload.record.user_id)
    .single();

  console.log('data: ', data);
  const push_token = data?.push_token;
  console.log('🚀 ~ Deno.serve ~ push_token:', push_token);

  const res = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Deno.env.get('EXPO_ACCESS_TOKEN')}`,
    },
    body: JSON.stringify({
      to: push_token,
      sound: 'default',
      body: payload.record.body,
      title: 'Work Work',
      data: {
        card: payload.record.card_id,
      },
    }),
  }).then((res) => res.json());

  return new Response(JSON.stringify(res), {
    headers: { 'Content-Type': 'application/json' },
  });
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
