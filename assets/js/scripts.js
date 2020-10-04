 
function applyRedirect(){
    const cards = document.querySelectorAll(".minimal")
    for (const card of cards) {
      card.addEventListener('click', function(event) {

        myu = card.getAttribute('key');
        window.open("/FitnessToday/user.html?uid="+ myu ,"_self");


      })
    }
}

function CreateLiveCard(doc){
     var userCard = document.createElement('div');
        var cardMinimal = document.createElement('div');
        var cardBody = document.createElement('div');
        var h4 = document.createElement('h4');
        var completion = document.createElement('div');
        var span = document.createElement('span');
        var img = document.createElement('img');
    
        userCard.classList.add('col-md-4','user-card');
        cardMinimal.classList.add('card','minimal');
        if(doc.data().pic==''){
            img.setAttribute('src','https://firebasestorage.googleapis.com/v0/b/simpledb-fc1f7.appspot.com/o/avatar%2Fkawaii%2F027-boy-8.svg?alt=media&token=d4cae482-de77-4099-8173-cf0867ff98c3');
        }
        else{
            img.setAttribute('src',doc.data().pic);
        }
        cardMinimal.setAttribute('key',doc.id)
        cardBody.classList.add('card-body');
        h4.classList.add('card-title');
        completion.classList.add('completion');
        
        span.appendChild(document.createTextNode(doc.data().completion))
        completion.appendChild(span);
        cardBody.appendChild(img);
        cardBody.appendChild(h4);
        cardBody.appendChild(completion);
        h4.appendChild(document.createTextNode(doc.data().first));
        cardMinimal.appendChild(cardBody);
        userCard.appendChild(cardMinimal);
        var insertCard = document.getElementById('cardsContainer').appendChild(userCard);
        
    return;
}

function updateRedirect(){
    const Update = document.getElementById('updatePlan');
    
    Update.addEventListener('click',(event)=>{
        myu = Update.getAttribute('key');
        window.open("/FitnessToday/update.html?uid="+ myu ,"_self");
    })
 }
function TodayList(list){
    console.log(list.data(),list.id)
    var tItemData = list.data();
    var success;
    if(tItemData.limit==tItemData.completed){
        success = 'complete';
    } else{
        success= 'inprogress';
    }
    var tItem = '<li class="list-group-item todayPlan" data-taskid='+list.id+'><span class="status '+success+'"><i class="la la-ellipsis-h"></i><i class="la la-thumbs-up"></i></span><span class="planName">'+tItemData.plan+'</span><span class="tmetric">'+tItemData.metric+'</span><span class="count"><span class="amount">'+tItemData.completed+'</span>/<span>'+tItemData.limit+'</span></span><div role="group" class="btn-group"><button class="btn btn-light decrementCount" type="button" data-limit='+tItemData.limit+' data-inc='+tItemData.increment+' onclick=DecrementCount(event)><i class="la la-minus"></i></button><button class="btn btn-light incrementCount" type="button"  data-limit='+tItemData.limit+' data-inc='+tItemData.increment+' onclick=IncrementCount(event)><i class="la la-plus"></i></button></div></li>'
    if(tItemData.limit==tItemData.completed){
        
    }
    $('.todayPlanContainer').append(tItem);
    
     return;
}   


   
     function IncrementCount(e){   
        
         
        if(e.target.nodeName=='I'){
           this_ = e.target.parentNode
        }else{
             this_ = e.target;
        }
         var taskId=$(this_).parents('li').attr('data-taskid');
         
           var current = parseInt($(this_).parent().siblings().find('.amount').html());
           var inc_ = parseInt($(this_).attr('data-inc'));
           var total = parseInt($(this_).attr('data-limit'));
           console.log(loggedId)
                if(current<total){
               current = current+inc_;
               $(this_).attr('data-current',current);
               $(this_).parent().siblings().find('.amount').html(current); 
                     updateIndValue(taskId,current);
           }  
         if(current==total){
             $(this_).parent().siblings('.status').removeClass('inprogress').addClass('complete');
         }
         calculateTotal()
  }
 function DecrementCount(e){   
     
         var this_;
        if(e.target.nodeName=='I'){
           this_ = e.target.parentNode
        }else{
             this_ = e.target;
        }
              var taskId=$(this_).parents('li').attr('data-taskid');

           var current = parseInt($(this_).parent().siblings().find('.amount').html());
           var inc_ = parseInt($(this_).attr('data-inc'));
           var total = parseInt($(this_).attr('data-limit'));
           console.log(current)
                if(current>0){
               current = current-inc_;
               $(this_).attr('data-current',current);
               $(this_).parent().siblings().find('.amount').html(current);    
                    updateIndValue(taskId,current);
           }      
     if(current!==total){
             $(this_).parent().siblings('.status').removeClass('complete').addClass('inprogress');
         }
     calculateTotal()
  }
  
function calculateTotal(){
    var percent = 0;
    var quantity = 0;
    var total = 0;
    var lists = document.querySelectorAll('.todayPlan');
    for(let list of lists){
        quantity  = quantity +  parseInt($(list).find('.amount').html());
       total =  total + parseInt($(list).find('.incrementCount').attr('data-limit'));
         
    }
    percent = ((quantity/total)*100).toFixed(0);
    console.log(quantity, total, percent);
    if(percent=='NaN'){
        percent = 0;
    }
    db.collection('users').doc(loggedId).update({
         completion:  percent
     }).then(function() {
            db.collection('users').doc(loggedId).get().then(qS =>{
                 document.getElementById('comlpetionValue').innerHTML = qS.data().completion;
            })
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
    
}

function updateIndValue(taskId,val_){
    
     db.collection('users').doc(loggedId)
        .collection('userData').doc('planList')
         .collection('planDetails').doc(taskId).update({
         completed: val_
     }).then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
}

function createUpdateList(planDetails,id_){
    var listGroupItem = document.createElement('li');
    var choosePlan = document.createElement('button');
    var circle = document.createElement('i');
    var circleCheck = document.createElement('i');
    var lName = document.createElement('span');
    var lMetric = document.createElement('span');
    var lInc = document.createElement('span');
    var editPlan = document.createElement('button');
    var delPlan = document.createElement('button');
    var delIcon = document.createElement('i');
    
    listGroupItem.classList.add('list-group-item');
    choosePlan.classList.add('btn','btn-sm','added','choosePlan');
    circle.classList.add('la','la-toggle-off');
    circleCheck.classList.add('la','la-toggle-on');
    lName.classList.add('lName');
    lMetric.classList.add('lMetric');
    lInc.classList.add('lInc');
    editPlan.classList.add('btn','btn-light','btn-sm','editPlan','hidden');
    delPlan.classList.add('btn','btn-sm','delPlan');
    delIcon.classList.add('la','la-trash');
    
    choosePlan.appendChild(circleCheck);
    lNameText = document.createTextNode(planDetails.plan);
    lName.appendChild(lNameText);
    lMetricText = document.createTextNode(planDetails.metric);
    lMetric.appendChild(lMetricText);
    lIncText = document.createTextNode(planDetails.limit);
    lInc.appendChild(lIncText)
    editPlanText = document.createTextNode('Edit');
    editPlan.appendChild(editPlanText);
    delPlan.appendChild(delIcon);
    
    listGroupItem.appendChild(choosePlan).setAttribute('type','button');
    listGroupItem.appendChild(lName);
    listGroupItem.appendChild(lMetric);
    listGroupItem.appendChild(lInc);
    listGroupItem.appendChild(editPlan);
    listGroupItem.appendChild(delPlan).setAttribute('itemId',id_);
    
    document.getElementById('planListContainer').appendChild(listGroupItem).setAttribute('id',id_);
    return;
    
}
