importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");
 firebase.initializeApp({
    projectId: 'realtimetrac-48416',
    appId: '1:511883410480:web:1f3c55eba43fb1cde141f5',
    storageBucket: 'realtimetrac-48416.appspot.com',
    apiKey: 'AIzaSyCzzjbLrQVh4tDlTje3hbkf1qPnXJ9QnTc',
    authDomain: 'realtimetrac-48416.firebaseapp.com',
    messagingSenderId: '511883410480',
    measurementId: 'G-TF5Z0SJ142',
});
 const messaging = firebase.messaging();