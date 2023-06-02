import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
import { auth } from "../service/firebase";
import {
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    User,
    onAuthStateChanged,
    signInWithCredential,
    setPersistence,
    browserLocalPersistence,
  } from "firebase/auth";
  
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.name === "login") {
        // Login request.
        console.log('background.js receive the message')
        var provider = new GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
  
        // Chrome extension only supports popup sign in.
        signInWithPopup(auth, provider).then(function (result) {
          var user = result.user;
          var status = '200';
          sendResponse({ user, status });
        }).catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          if (errorCode === 'auth/account-exists-with-different-credential') {
            alert('You have already signed up with a different auth provider for that email.');
            // If you are using multiple auth providers on your app you should handle linking
            // the user's accounts here.
          } else {
            console.error(error);
          }
          var status = '400';
          sendResponse({ error, status });
        });
      } else {
        var error = "unknown request: " + request.name;
        console.error("unknown request", request.name);
        var status = '400';
        sendResponse({ error, status });
      }
  
      return true;
    });
    
reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

// var auth = firebase.auth();
// var functions = firebase.functions();



chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: contentScriptFunc,
        args: ['action'],
    });
});

function contentScriptFunc(name) {
    alert(`"${name}" executed`);
}