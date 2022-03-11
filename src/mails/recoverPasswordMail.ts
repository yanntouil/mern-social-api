import config from 'config'
import mailService from '../services/mailService'
import layout from './layout'


const templateHTML = ({ username, link }: { username: string, link: string }) => `
<p><strong>Hi ${username},</strong><br /></p>
<p>
    You as ask to recover your passeword, If that's not you, disregard this message. Otherwise, click on the button below.
</p>
<div style="text-align: center;">
    <a href="${link}" style="display:inline-block;margin-top:14px;margin-bottom:18px;text-transform:uppercase;color:#ffffff;text-decoration:none;background-color:#13abe4;border-color:#13abe4;border-style:solid;border-radius:2px;border-top-width:18px;border-bottom-width:18px;border-left-width:40px;border-right-width:40px;font-size:17px;line-height:20px;white-space:nowrap" target="_blank">
        Validate my email address
    </a>
</div>
<p>
    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem magnam labore voluptatum quasi sequi ullam tempora placeat id ducimus, voluptate perferendis et, expedita qui provident distinctio, molestiae doloremque. Numquam, maiores.
</p>
`
const templateText = ({ username, link }: { username: string, link: string }) => `
Hi ${username},

You as ask to recover your passeword, If that's not you, disregard this message. Otherwise, click on the button below.

${link}

Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem magnam labore voluptatum quasi sequi ullam tempora placeat id ducimus, voluptate perferendis et, expedita qui provident distinctio, molestiae doloremque. Numquam, maiores.
`
export default async function recoverPasswordMail({username, email, link}: { username: string, email: string, link: string }) {
    return mailService.sendMail({
        from: config.get<string>('mailFrom'),
        to: email,
        subject: `Recovering your password`,
        text: templateText({username, link}),
        html: layout(templateHTML({username, link})),
    })
}