import { Twilio } from 'twilio';

export default async function makeCall(recipient: string, message: string) {
    try {    
        const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        client.calls.create({
            twiml: `<Response><Say>${message}</Say></Response>`,
            to: recipient,
            from: process.env.MY_NUMBER!,
        })
            .then((message) => console.log(message.sid));
    } catch(err) {
        console.log(err);
    }
}