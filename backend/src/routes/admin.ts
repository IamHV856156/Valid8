import { Hono } from 'hono';
import { supabase } from '../services/db';
import { generateToken } from '../services/hmac';
import { sendQrEmail} from '../services/mailer';

const admin = new Hono();

admin.post('/import/:slug', async (e) => {
  const slug = e.req.param('slug');
  let participants = await e.req.json(); 
  const results =[];
  for (const p of participants) {
    const id = crypto.randomUUID();
    const token = generateToken(id, slug);

    const { data,error } = await supabase.from('participants').insert([{
      id, name: p.name, email: p.email, event_slug: slug, token
    }]).select().single();
   
    if (error) {
      console.error(`DB Error for ${p.email}:`, error.message);
      results.push({ email: p.email, status: 'failed', error: error.message });
      continue; // Skip to next person if DB insert fails
    }
    if (data) {
      try {
        // Added 'await' so the loop waits for the email to send
        await sendQrEmail(data.email, data.name, data.id, slug, token);
        console.log(`Email sent to: ${data.email}`);
        results.push({ email: p.email, status: 'success' });
      } catch (mailError: any) {
        console.error(`Mail Error for ${p.email}:`, mailError.message);
        results.push({ email: p.email, status: 'mail_failed', error: mailError.message });
      }
    }
  }
  return e.json({ success: true, message: "Import started" });
});

export default admin;