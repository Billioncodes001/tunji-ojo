import type { EmailAdapter } from 'payload'
export function newsroomEmail(binding: any): EmailAdapter {
 return () => ({
  name: 'Cloudflare Email Service', defaultFromAddress: 'accounts@newsroom.olubunmitunjiojo.com', defaultFromName: 'Tunji-Ojo Newsroom',
  sendEmail: async message => {
   if (!binding) throw new Error('Account email is not configured. Contact the publishing administrator.')
   const recipients = (Array.isArray(message.to) ? message.to : [message.to]).map(v => typeof v === 'string' ? v : v?.address).filter(Boolean)
   return binding.send({from:{email:'accounts@newsroom.olubunmitunjiojo.com',name:'Tunji-Ojo Newsroom'},to:recipients,subject:message.subject||'Newsroom account',html:typeof message.html==='string'?message.html:undefined,text:typeof message.text==='string'?message.text:undefined})
  },
 })
}
