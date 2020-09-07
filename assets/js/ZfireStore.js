//--------------------------Firestore config
let loggedId;
firebase.initializeApp({
   apiKey: "AIzaSyD5YrGi_v5sCbUQiTuPZrP8wY6ComI5WZE",
  authDomain: "simpledb-fc1f7.firebaseapp.com",
  projectId: "simpledb-fc1f7",
});

var db = firebase.firestore();

//__________________________Add new user

function AddNewUser(first_,last_){
     
    db.collection("users").add({
        first: first_,
        last: last_,
        completion: 0
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
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

function GetUserData(uId){
    loggedId=uId;
     db.collection("users").doc(loggedId).get().then((querySnapshot) => {
        var userDetails = querySnapshot.data()
        document.getElementById('profileName').innerHTML= userDetails.first+' '+userDetails.last;
        document.getElementById('comlpetionValue').innerHTML = userDetails.completion;
        document.getElementById('updatePlan').setAttribute('key',uId);
        updateRedirect();
              db.collection("users").doc(loggedId).collection("userData").get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        var temp =new Date()
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
    window.open("user.html?uid="+ loggedId ,"_self");
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
          document.getElementById('comlpetionValue').innerHTML = userDetails.completion;
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
//----------- find page and act

$(document).ready(function(){
 

  let arr = window.location.search.split('=');
    let path = window.location.pathname;
    
    // console.log( arr[1],window.location.pathname)

    if(path=="/update.html"){
          UpdatePlan(arr[1]);
    }

    if(path=="/user.html"){
          GetUserData(arr[1]);
    }

    if(path=="/index.html"){
             CreateCards();
     }
})