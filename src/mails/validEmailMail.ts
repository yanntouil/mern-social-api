import config from 'config'
import mailService from '../services/mailService'
import layout from './layout'


const templateHTML = ({ username, link }: { username: string, link: string }) => `
<p><strong>Hi ${username},</strong><br /></p>
<p>
    You have just changed your email address, please confirm it by clicking on the button below.
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

Thanks for registrer on website and welcome on our universe. You have one last thing to do before using your personal space: validate your email address by opening this link.

${link}

Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem magnam labore voluptatum quasi sequi ullam tempora placeat id ducimus, voluptate perferendis et, expedita qui provident distinctio, molestiae doloremque. Numquam, maiores.
`
export default async function validEmailMail({username, email, link}: { username: string, email: string, link: string }) {
    return mailService.sendMail({
        from: config.get<string>('mailFrom'),
        to: email,
        subject: `Confirmation of your new e-mail`,
        text: templateText({username, link}),
        html: layout(templateHTML({username, link})),
    })
}