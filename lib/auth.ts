import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { magicLink } from "better-auth/plugins";
import { Resend } from "resend";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const resend = new Resend(process.env.RESEND_API_KEY!);

export const auth = betterAuth({
  database: pool,
  disableSignUp: true,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    magicLink({
      expiresIn: 300,
      disableSignUp: true,
      async sendMagicLink({ email, token, url }) {
        try {
          const res = await resend.emails.send({
            from: "Oleum Extra <no-reply@oleumextra.es>", 
            to: [email],
            subject: "Tu enlace mágico de acceso",
            html: `<p>Haz clic en el siguiente enlace para iniciar sesión:</p>
                   <a href="${url}">${url}</a>`,
          });

          console.log("Correo enviado:", res);
        } catch (error) {
          console.error("Error al enviar el correo:", error);
        }
      },
    }),
  ],
});
