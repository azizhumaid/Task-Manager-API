const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const welcomeEmail = (email,name)=>{
    console.log(email)
    sgMail.send({
        to: email,
        from:'azizhumaid@hotmail.com',
        subject:'Who invited you',
        text: `${name} You are not welcomed here `
    }).then(() => {
        console.log('Email sent')
      }).catch((error) => {
        console.error(error)
      })
}

const leaveEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from:'azizhumaid@hotmail.com',
        subject:'Please never come',
        text: `${name} Thank you for leaving us `
    }).then(() => {
        console.log('Email sent')
      }).catch((error) => {
        console.error(error)
      })
}

module.exports = {
    welcomeEmail,
    leaveEmail
}