
$(document).ready(function(){
    $('.modal').modal();
})

var clickedID = "";

$(".noteBtn").on("click", function(data){
    clickedID = $(this).attr("value");

    $.ajax("")
});

$("#Submit").on("click", function(data){
    event.preventDefault();
    
    //var note = $("#noteBody").val();
    var id = clickedID;
    //console.log(note);
    var data = {
        note: $("#noteBody").val()
    };

    $.ajax("/note/" + id, {
        type: "POST",
        data: data
    }).then(function(data){
        setTimeout(function(){
            location.reload();
        },1000);
    })
    


})