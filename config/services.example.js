module.exports = {
    facebook : {
        clientID      : 'your-secret-clientID-here',
        clientSecret  : 'your-client-secret-here',
        callbackURL   : '/auth/facebook/callback'
    },
    firebase: {
        apiKey: "<your api key>",
        authDomain: "yourapp.firebaseapp.com",
        databaseURL: "https://yourapp.firebaseio.com",
        storageBucket: "firebase-yourapp.appspot.com",
        messagingSenderId: "<your messaging sender id>",
        credential: "path/to/serviceAccountKey.json"
    },
    session: {
        express: {
            secret: (typeof process.env.EXPRESSSESSION_SECRET === 'undefined') ? 'secret' : process.env.EXPRESSSESSION_SECRET
        },
        firebase: {
            host: '<YOUR-FIREBASE-SESSIONS-PROJECT>.firebaseio.com'
            token: 'your-firebase-secret-here'
        }
    },
    jwt: {
        secret: (typeof process.env.JWT_SECRET === 'undefined') ? 'secret' : process.env.JWT_SECRET
    }
};
