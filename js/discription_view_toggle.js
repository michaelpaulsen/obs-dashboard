
/*
<input type="button" value="table veiw" id="stream_marker_discription_table_toggle" class="toggle mode1">
<div id="discription_view">
<div id="table_veiw">
*/
let marker_view_toggle = $("#stream_marker_discription_table_toggle"); 
let discription_view = $("#discription_view"); 
let table_veiw = $("#table_view"); 


marker_view_toggle.on("click",  (e)=> { 
        table_veiw.toggle(); 
        discription_view.toggle();
        if(marker_view_toggle.val() == "table mode"){ 
            marker_view_toggle.val("text mode");  
        }else { 
            marker_view_toggle.val("text mode");  

        }
});
