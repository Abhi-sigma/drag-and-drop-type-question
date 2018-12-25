var drag_drop_pairs={};
var answer_pair=[];
var check_answer_pair=[];
var draggables_value={};
////////////////////////////////////////////////////////////////////////////////////////

//on each drop increases the count and checks if the count is equal to number of options
function check_answer_button_display(){
    var count = 0;
    for (var i in drag_drop_pairs) {
        if (drag_drop_pairs.hasOwnProperty(i)) 
            count++;
       }
       if (count==$("#textqsn").children().length){
        document.getElementById("checkans").style.display="block"
       }
}

////////////////////////////////////////////////////////////////////////////////////////////////


// the main jquery based script
function init(){

document.getElementById("checkans").style.display="none";

$("#answer").children().draggable({
	cursor:"move",
    revert:true,
    start:function(event,ui){
        var draggable_id=$(this).attr("id");
        console.log(draggable_id);
        for(var key in drag_drop_pairs){
            console.log(key);
            if(drag_drop_pairs.hasOwnProperty(key)){
                console.log("has");
                console.log(drag_drop_pairs[key]);
                if (drag_drop_pairs[key]==draggable_id){ 
		
		//this block checks if the option is already been dragged
		//if yes,than that option is in drag drop pair,so if dragged again it renables the blank which was
		//disabled once the word was drpped in the blank.
                    
		    console.log(String(key))
                    console.log("true");
                    $("#"+key).droppable("enable")
		    
		    /


                }
            }
        }
        console.log("start");
        

    }
               
    
});



$("#textqsn").children().droppable({
	drop:function(ev, ui) {
        var dropped = ui.draggable;
        console.log(dropped);
        var droppedOn = $(this);
        console.log(droppedOn);
        width_to_set=droppedOn.width();
        ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
        ui.draggable.draggable("option","revert",false);
        // drag_drop_pairs.key=value;
         var dropzone=($(this).attr("id"));
         console.log(dropzone);
         var value=$(ui.draggable).attr("id");
         var drag_value=$(ui.draggable).text();
         console.log(drag_value);
         draggables_value[value]=drag_value; //keeps track of which values are in which draggables
         drag_drop_pairs[dropzone]=value; //keeps track of which draggables are dropped on which droppables
        console.log((drag_drop_pairs));
        check_answer_button_display();
        // $(this).addClass("dropped");
        $(this).droppable("disable");


         

        // $(dropped).css("width",width_to_set)
        
    },
    over:function(ev, ui) {
        $(this).addClass("overclass")

    },
    out:function(ev, ui) {
        $(this).removeClass("overclass")
    }

    
}); 

} //close init

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function get_qsn_ans(){
    serve_qsn();
    serve_ans();
    

////////////////////////////////////////////////////////////////////////////////////////////
function serve_qsn(){
    var getqsn_button = document.getElementById("getqsn")
    if(getqsn_button.style.display="block"){    
               getqsn_button.style.display="none"; 
        }

        var request_qsn=new XMLHttpRequest();
        request_qsn.open("POST","/qsn");#change this according to your url endpoint
   
        request_qsn.onreadystatechange=function () {
            
            if (request_qsn.readyState==4 && request_qsn.status==200){
                console.log("file requested");
                console.log(qsn_data)
                var qsn_data = request_qsn.responseText;
                console.log(typeof(qsn_data))
            if (qsn_data == "no new question found"){
               document.getElementById("flex-container").style.display="none";
               document.getElementById("not-found").innerHTML="<h1>Congrats you completed,"
               document.getElementById("instructions-text").style.display="none";
           } //end of if

            
           else{
            document.getElementById("instructions-text").style.display="none";
            document.getElementById("original-text").style.display="none";
            qsn_json_data={};
            qsn_json_data["qsn"]=JSON.parse(qsn_data);
            console.log(qsn_json_data.qsn.qsn);
            document.getElementById("flex-container").style.visibility="visible";
            document.getElementById("textqsn").innerHTML=qsn_json_data.qsn.qsn;
            $(init);
            

           
           }
       }
   }
   request_qsn.send()
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function serve_ans(){
   
    var request_qsn=new XMLHttpRequest();
    request_qsn.open("POST,"/ans");//CHANGE 
   
     request_qsn.onreadystatechange=function () {
            
            if (request_qsn.readyState==4 && request_qsn.status==200){
            console.log("file requested");
            var ans_data = request_qsn.responseText;
            console.log(typeof(qsn_data))
            if (ans_data == "no new question found"){
               
            
           } //end of if
           else{
            var qsn_ans_data={};
            // document.getElementById("answer").style.display="block";

            qsn_ans_data["ans"]=JSON.parse(ans_data);
            // console.log(qsn_ans_data.ans);
            list=qsn_ans_data.ans
            console.log(list)
            $("#answer").empty();
            answer_pair=[];
            drag_drop_pairs={};
            check_answer_pair=[];
            for(items in list){
                var count=1;
                var draggables_list=list[items];                                  
                console.log(answer_pair); 
                
                for(objects in draggables_list){                //loop through each object
                    var value_pair=draggables_list[objects];    //this gives the object inside the list
                    for(values in value_pair){                 //loop through eack keys
                        answer_pair.push(value_pair[values]);
                        console.log(answer_pair);   
                        count=count+1;

                    }

                }
                
            }
            
            

           
           }
           randomized_generate_draggables();
       }
   }
   request_qsn.send()
}



//////////////////////////////////////////////////////////////////////////////////////


function check_answer(){
  document.getElementById("checkans").style.display="none";
    var count=1
    while(count<=answer_pair.length){
        var id="drop"+count;
        console.log(id);
        var drag_id=drag_drop_pairs[id];
        console.log(drag_id);
        var check_value=draggables_value[drag_id];
        check_answer_pair.push(check_value);
        console.log(check_answer_pair);
        count=count+1;
        console.log(count);
    }
       document.getElementById("ans_status").style.display="block";
       document.getElementById("markasdone").style.display="block";
       $("#checkdrag1,#checkdrag2,#checkdrag3,#checkdrag4,#checkdrag5,#checkdrag6").draggable("disable");
        if(JSON.stringify(check_answer_pair)==JSON.stringify(answer_pair)){
        document.getElementById("ans_status").innerHTML="<h2>Correct<h2>";
        document.getElementById("original-text").style.display="block";
        document.getElementById("original-text").innerHTML="Original Text"+"<br>"+qsn_json_data.qsn.org_text;
         }

       else{
        document.getElementById("ans_status").innerHTML="<h2>Incorrect<h2>";
        document.getElementById("original-text").innerHTML="Original Text"+"<br>"+qsn_json_data.qsn.org_text;
        document.getElementById("original-text").style.display="block";


         }

     }
//copied pasted script
function shuffle(array) {       //function to randomize list
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


function randomized_generate_draggables(){
    var array = (JSON.parse(JSON.stringify(answer_pair)));
    random_array=shuffle(array);
    var count=1;
    for (items in array){
        var draggables=document.createElement("div");
        draggables.id="checkdrag"+(count);
        //console.log(draggables.id);
        draggables.class="answerlist";
        //console.log(randomized_list);
        draggables.innerHTML=random_array[items];
        document.getElementById("answer").style.display="block";
        // document.getElementById("answer").innerHTML="";
        document.getElementById("answer").appendChild(draggables);
        count=count+1;
        $(init);

    }
}


