firebase.initializeApp({
    apiKey: "AIzaSyD5YrGi_v5sCbUQiTuPZrP8wY6ComI5WZE",
    authDomain: "simpledb-fc1f7.firebaseapp.com",
    databaseURL: "https://simpledb-fc1f7.firebaseio.com",
    projectId: "simpledb-fc1f7",
    storageBucket: "simpledb-fc1f7.appspot.com",
    messagingSenderId: "398743346204",
    appId: "1:398743346204:web:6c1426987a29d8ccd613d9"

});

var db = firebase.firestore();

var img_index = 1;
var storageRef = firebase.storage().ref();
var listRef = storageRef.child('avatar/kawaii');

function loadAvatars(){
listRef.listAll().then(function(result){
    console.log(result);
    result.items.forEach(function(imgRef){
        imgRef.getDownloadURL().then(function(url){
            var img = $('<img />').attr({
                'id': 'avatar'+img_index,
                'src': url,
                'alt': 'image',
                'title':'avatar'+img_index,
                'class':'avatarImg',
                'onclick':'setTempImg(src)'
            }).appendTo('.modal-body');

            img_index++;
        });
    })
}).catch(function(error){
    console.log(error);
});
}

let chosenPic;

function setTempImg(val){
    chosenPic=val;
    $('.profile').attr('src',val);
}

$('.changeAvatar').on('click',function(){
    $('.modal').addClass('show').css('display','block');
    loadAvatars();  
})

$('.closeModal').on('click',function(){
    $('.modal-body').html('')
    $('.modal').removeClass('show').css('display','none');
})

 
//--------------------------Firestore config
let loggedId;


//__________________________Add new user

function AddNewUser(first_,last_,group_,uid_){
     
    db.collection("users").add({
        first: first_,
        last: last_,
        group: group_,
        uid: uid_,
        completion: 0,
        pic:''
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
         $('.alert-success').addClass('success').html('<span>Registration successful !</span>');
          setTimeout(()=>{
              $('.alert-success').removeClass('success').html('');
              $('input').val('');
          },5000);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
        $('.alert-warning')
              .addClass('error')
              .html('<span>'+error.message+'</span>');
          setTimeout(()=>{
              $('.alert-warning').removeClass('error').html('');
              $('input').val('');
          },5000)
    });
}

 function UpdateFromProfile(first_,last_,group_,uid_){
     var UDb = db.collection("users");
    UDb.where('uid','==',uid_).get().then((querySnapshot) => {
          var temp = querySnapshot
          temp.forEach(item=>{
              UDb.doc(item.id).update({
                  first:first_,
                  last:last_,
                  pic:chosenPic
              })
              UpdateProfileName(first_+' '+last_);
              UpdateProfilePic(chosenPic);
          })
    })  
    .then(function(docRef) {
        console.log("Document written successfully");
        $('.alert-success').addClass('success').html('<span>Profile update successful !</span>');
          setTimeout(()=>{
              $('.alert-success').removeClass('success').html('');
          },5000);
       
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
         $('.alert-warning')
              .addClass('error')
              .html('<span>'+error.message+'</span>');
          setTimeout(()=>{
              $('.alert-warning').removeClass('error').html('');
          },5000)
    });
}

//_____________________ Read data
function CreateCards(){
    db.collection("users").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // console.log(doc.id,doc.data());
        CreateLiveCard(doc);
        applyRedirect();
        });
    });
}
//____________________________________ get User data

function GetUserData(uId,FTid){
    loggedId=uId;
     db.collection("users").doc(loggedId).get().then((querySnapshot) => {
        var userDetails = querySnapshot.data()
        console.log(querySnapshot.data())
        document.getElementById('profileName').innerHTML= userDetails.first+' '+userDetails.last;
        document.getElementById('comlpetionValue').innerHTML = userDetails.completion;
        document.getElementById('updatePlan').setAttribute('key',uId);
         if(userDetails.pic){
             console.log(userDetails.pic);
             $('.profile').attr('src',userDetails.pic);
         }
        if(FTid==userDetails.uid){
            document.getElementById('contentEditable').setAttribute('aria-editable',true);
        }
        updateRedirect();
              db.collection("users").doc(loggedId).collection("userData").get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        var temp =new Date();
                       document.getElementById('showDate').innerHTML = doc.data().day.toDate().toDateString()   ;
                    });
                })
    });
    
     db.collection('users').doc(loggedId)
        .collection('userData').doc('planList')
         .collection('planDetails').get().then(querySnapshot=>{
            querySnapshot.forEach(list_=>{ 
               TodayList(list_);
                
            })
          calculateTotal()
     });
          
    // ShowTodaysList();
    
}

//----------------------------
function ClearContents(){
  $('.form-group').find('input').val('');
}

function goBackToUser(){
    window.open("FitnessToday/user.html?uid="+ loggedId ,"_self");
}

function applyDel(){
   $(".delPlan").click(function(){
       var itemId = $(this).attr('itemId');
             db.collection('users').doc(loggedId)
        .collection('userData').doc('planList')
                 .collection('planDetails').doc(itemId).delete().then(function() {
                    console.log("Document successfully deleted!");
                    $( "li[id="+itemId+"]" ).remove( ".list-group-item" );
                }).catch(function(error) {
                    console.error("Error removing document: ", error);
                });
        });
        ClearContents();
}
//----------------------------update plan

function UpdatePlan(uId){
    loggedId =uId;
     db.collection("users").doc(uId).get().then((querySnapshot) => {
        var userDetails = querySnapshot.data()
        document.getElementById('profileName').innerHTML= userDetails.first+' '+userDetails.last;
         var photoURL = userDetails.pic;
          if(photoURL!==''){
              $('.profile').attr('src',photoURL);
           }
         let temp = db.collection("users").doc(uId).collection("userData");
           
         temp.get().then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    var temp =new Date()
                   document.getElementById('showDate').innerHTML = doc.data().day.toDate().toDateString()   ;
                    
                });
            })
         
         temp.doc('planList').collection('planDetails').get().then(querySnapshot=>{
            querySnapshot.forEach(it_=>{
                console.log(it_.data())
                createUpdateList(it_.data(),it_.id);
                
            })
             applyDel();
         })
        
    });
    return;
}
//_______________________ create plan

function CreateNewPlan(p,l,m,inc){
     db.collection('users').doc(loggedId)
        .collection('userData').doc('planList')
         .collection('planDetails').add({
         plan: p,
         limit: l,
         metric: m,
         increment: inc,
         completed: 0
     }).then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
         document.querySelectorAll('.form-control').value='';
         $('li').remove('.list-group-item');
         UpdatePlan(loggedId);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
   
}


function DeleteItem(){
     
    db.collection('users').doc(loggedId)
        .collection('userData').doc('planList')
        .collection('planDetails').doc(id_).delete().then(function() {
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
}

function GetProfileDetails(){
    firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL ;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    // ...
      loggerDetails={
          displayName,email,emailVerified,photoURL,isAnonymous,uid,providerData
      }
      console.log(loggerDetails);
       var fullname ;
      
      if(displayName){
         fullname = displayName.split(' ');
            $('.updateProfile').find('input[name="firstname"]').val(fullname[0]);
           $('.updateProfile').find('input[name="lastname"]').val(fullname[1]);
         }
       $('.updateProfile').find('input[name="email"]').val(email);
       $('.updateProfile').find('input[name="uid"]').val(uid); 
      if(photoURL!==''){
          $('.profile').attr('src',photoURL);
          chosenPic=photoURL;
      }
       
    
  } else {
    // User is signed out.
    // ...
  }

    })
}
function setUserName(FTuser){
     db.collection("users").where("uid", "==", FTuser[0])
.get().then((querySnapshot)=>{
                querySnapshot.forEach(user=>{
                    console.log(user.data())
                    if(user.data().first==''){
                        $('.userName').html(FTuser[1])
                    }else{
                        $('.userName').html(user.data().first)
                    }
                })
            });
}

function pageVerification(FTuser,path){
   
        if(path!=='FitnessToday/login.html'||'FitnessToday/register.html'){
            console.log(FTuser[0])
            setUserName(FTuser);
          
        } else{
              window.open('FitnessToday/index.html','_self');
        }
       
    
}

//----------- find page and act

$(document).ready(function(){
 

    let arr = window.location.search.split('=');
    let path = window.location.pathname;
    console.log(path);
    if(path=="/FitnessToday/"){
        window.open('/FitnessToday/index.html','_self');
    }
    let temp = localStorage.getItem('FTuser');
    let FTuser;
    if (temp){
        FTuser = temp.split(',');
        pageVerification(FTuser,path);
    }
    if(!FTuser){
         if(path=='/FitnessToday/login.html'||'/FitnessToday/register.html'){
            
        }      else{
                    window.open('/FitnessToday/login.html','_self');

        }
         
    }
    // console.log( arr[1],window.location.pathname)

    if(path=="/FitnessToday/update.html"){
          UpdatePlan(arr[1]);
    }

    if(path=="/FitnessToday/user.html"){
          GetUserData(arr[1],FTuser[0]);
    }

    if(path=="/FitnessToday/index.html"){
             CreateCards();
        console.log('checking status..');
        // signedInDetails();
     }
    
    if(path=="/FitnessToday/profile.html"){
        GetProfileDetails();
    }
    
   
    //---------------------Logout
    
    $('.logout').on('click',(e)=>{
        e.preventDefault();
        Signout();
    })
    
    
})
