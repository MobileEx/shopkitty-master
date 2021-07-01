const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const twilio = require('twilio');
const accountSid = 'Axxxxxxxxxxxxxxxxxxxxxxxxxxx';
const authToken = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx';


console.log(`Twilio account: ${accountSid}`);

const client = new twilio(accountSid, authToken);

const twilioNumber = '+1xxxxxxxxx';
exports.smsModule = functions.firestore
    .document('sms/{id}')
    .onUpdate((snap, context) => { 
        try {
            const newValue = snap.after.data();
            newValue.to.map((item) => {
                var textMessage = {
                    body: `${newValue.name} invites your to 'Shoes' chat.
                    Click here to join the chat.

                    If you don't have the ShopKitty app yet click here to install it.`,
                    to: item,
                    from: twilioNumber
                };
                var message = client.messages.create(textMessage);
                console.log("message",message)
                return message
            })
        }
        catch (err) {
            console.log (err);
        }
    });