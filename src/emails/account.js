const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const welcomeEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from:'azizhumaid@hotmail.com',
        subject:'Who invited you',
        text: `${name} You are not welcomed here `
    })
}

const leaveEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from:'azizhumaid@hotmail.com',
        subject:'Please never come',
        text: `${name} Thank you for leaving us `
    })
}

module.exports = {
    welcomeEmail,
    leaveEmail
}