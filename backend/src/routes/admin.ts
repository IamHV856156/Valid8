import { Hono } from 'hono';
import { supabase } from '../services/db';
import { generateToken } from '../services/hmac';
import { sendQrEmail} from '../services/mailer';

const admin = new Hono();

admin.post('/import/:slug', async (e) => {
  const slug = e.req.param('slug');
  let participants = await e.req.json(); 

  for (const p of participants) {
    console.log("Current Participant Data:", p);
    const id = crypto.randomUUID();
    const token = generateToken(id, slug);

    const { data } = await supabase.from('participants').insert([{
      id, name: p.name, email: p.email, event_slug: slug, token
    }]).select().single();

    if (data) {
      sendQrEmail(data.email, data.name, data.id, slug, token).catch(console.error);
    }
  }
  return e.json({ success: true, message: "Import started" });
});

export default admin;