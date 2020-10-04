 var loggerDetails;
 

 
   //Create User with Email and Password
function CreateNewUser(email,password){
    console.log(email,password)
  firebase.auth().createUserWithEmailAndPassword(email, password).then(data=>{
     var newUser = AddNewUser('','',1,data.user.uid);
      if(newUser){
          console.log(newUser);
         
      }
     
  }).catch(function(error) {
       
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
  });
}
    //Sign In User with Email and Password

function SignInUser(email,password){
  firebase.auth().signInWithEmailAndPassword(email, password).then((data)=>{
      console.log(data.user.uid,data.user.email)
      localStorage.setItem('FTuser',[data.user.uid,data.user.email]);
       setTimeout(function(){
          window.open('/index.html','_self');
      }, 3000);
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
});
}
//Set an authentication state observer and get user data
function setAuthObserver(){
 firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    // ...
      loggerDetails={
          displayName,email,emailVerified,photoURL,isAnonymous,uid,providerData
      }
      $('.userName').html(email);
    let arr = window.location.search.split('=');
    let path = window.location.pathname;
       if(path=="/login.html"){
       window.open('index.html','_self');
    }
    
  } else {
    // User is signed out.
    // ...
  }
});
}
 
//Sign out
function Signout(){
firebase.auth().signOut().then(function(data) {
  // Sign-out successful.
  console.log(data,'User Logged Out!');
    localStorage.removeItem('FTuser');
      setTimeout(function(){
          window.open('FitnessToday/login.html','_self');
      }, 3000);
}).catch(function(error) {
  // An error happened.
  console.log(error);
});
}
// Signout();
//Get signed in user details
function signedInDetails(){
    
var user = firebase.auth().currentUser;
    if (user) {
        console.log(user)
  // User is signed in.

    // The user's ID, unique to the Firebase project. Do NOT use
    // this value to authenticate with your backend server, if
    // you have one. Use User.getToken() instead.
      
      var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
  
    // ...
      loggerDetails={
          displayName,email,emailVerified,photoURL,isAnonymous,uid  }
        
   
} else {
  // No user is signed in.
    console.log('not signed in');
  
}
}

//Update user details
function UpdateProfileName(val){
var user = firebase.auth().currentUser;
    user.updateProfile({
    displayName: val
 }).then(function() {
  console.log('User Profile Updated Successfully');
        
}).catch(function(error) {
    console.log(error)
});
}
function UpdateProfilePic(val){
var user = firebase.auth().currentUser;
    user.updateProfile({
    photoURL:val
}).then(function() {
  // Update successful.
  console.log('User Profile Updated Successfully');
       
}).catch(function(error) {
  // An error happened.
});
}

//Set user email id
function SetUserEmail(){
var user = firebase.auth().currentUser;user.updateEmail("user@example.com").then(function() {
  // Update successful.
}).catch(function(error) {
  // An error happened.
});
}
//send verification email
function VerificationMail(){
var user = firebase.auth().currentUser;user.sendEmailVerification().then(function() {
  // Email sent.
}).catch(function(error) {
  // An error happened.
});}

//set password
function ResetPassword(){
var user = firebase.auth().currentUser;
var newPassword = getASecureRandomPassword();user.updatePassword(newPassword).then(function() {
  // Update successful.
}).catch(function(error) {
  // An error happened.
});
}
//var auth = firebase.auth();
function SendPasswordReset(){
var emailAddress = "user@example.com";auth.sendPasswordResetEmail(emailAddress).then(function() {
  // Email sent.
  console.log('Email Sent');
}).catch(function(error) {
  // An error happened.
});
}
//Delete user
function DeleteUser(){
var user = firebase.auth().currentUser;user.delete().then(function() {
  // User deleted.
  console.log('User Deleted');
}).catch(function(error) {
  // An error happened.
});
}
