import nodemailer from 'nodemailer';

// Lazily build the transporter so env vars are read at send time (after
// dotenv has loaded). If no SMTP credentials are configured we fall back to
// a no-op transport that logs instead of throwing — the API keeps working.
let cached = null;

function getTransport() {
  if (cached) return cached;

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    cached = {
      async sendMail(opts) {
        console.warn(`✉️  Email not sent (EMAIL_USER/EMAIL_PASS not configured). Would send "${opts.subject}" to ${opts.to}`);
        return { accepted: [], skipped: true };
      },
    };
    return cached;
  }

  cached = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
  return cached;
}

const transporter = {
  sendMail: (opts) => getTransport().sendMail(opts),
};

export default transporter;
