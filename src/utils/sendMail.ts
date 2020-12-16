import { MailerService } from '@nestjs-modules/mailer';
let mailerService: MailerService;

export const sendMail: any = async (email, sub, OTPcode) => {
  let subject;
  let html;
  const res = await mailerService.sendMail({
    to: email, // list of receivers
    from: '"Saro Classic" <saroclassicofficial@gmail.com>', // sender address
    subject, // Subject line
    text: '', // plaintext body
    html: `<h3>${html}</h3>`, // HTML body content
  });
  return res;
};
