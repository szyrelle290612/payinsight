import NodeMailer from 'nodemailer';

export const sendEmail = (email, token, status) => {
    console.log(token)
    let body = ""
    if (status == "validate") {
        body = ` Click to verify your account here! <a href="/verify-email/${token}">Verify Account</a>` // html body
    } else {
        body = ` Click to reset your password here! <a href="${token}">Reset Password</a>` // html body
    }

    const transporter = NodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'hrteam2929@gmail.com',
            pass: 'hxmheemqtrfcynio'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: 'hrteam2929@gmail.com',// sender address
        to: email, // list of receivers
        subject: "Apply for Applicant", // Subject line
        text: "Hi nice to meet you",
        html: body,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            throw new Meteor.Error("unable to send email please try again");
        } else {
            console.log(info)
        }

    });
};