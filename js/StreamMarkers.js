let markers = {};
let marker_table_body = $("#markers tbody"); 
let marker_misc_count = 0; 
let marker_max_markers_of_same_name = 10; 
function PrintMarkerData(output, data_name) { 
    output.append("00:00:00 intro\n");     
	for(let marker in markers){ 
		try{
            let mk = markers[marker]; 
            if(mk == null){ 
                continue; 
            }
			output.append(`${mk[data_name]} ${mk.notes}\n`)
			} catch(e){
				continue;
			}
	}
    
}
function updateMarkers(){ 
	let output = $("#markers_output"); 
	output.empty();
    output.append("--Twitch--\n"); 
    PrintMarkerData(output, "TwitchData"); 
	output.append("--YT--\n"); 
    PrintMarkerData(output,"ytData");
}

function addMarker(notes, d){
		//the server return the inputs as a JSON object of
        // a list of all of the inpts these are the inputs that we currently add
        //to our data object
        //NOTE: the name of the output may change this is just the way I have it
        //this may need to be changed for you!
        //TODO: I bet that the name can be determined algorithmicly write
        //write something to do that
        let TwitchData = d["aitum_multi_output_Twitch Output"];
        let ytData = d["adv_stream"];
        //it seems that when inactive the twich stream's
        //output is not in the list of outputs if it is undefined then
        //set it to 00:00:00 so that it is not!
        if(TwitchData == undefined) {
            TwitchData = "00:00:00";
        }else{
            TwitchData = TwitchData.timeCode.split(".")[0];
        }
        //the same seems to be true for the YT stream output
        if(ytData == undefined) {
            ytData = "00:00:00";
        }else{
           ytData = ytData.timeCode.split(".")[0]
        }
        //if you add an empty note then YT doesn't like it so
        //this sets a default note for the marker if there's not one already
        if(notes == "" || notes == " " ) notes = `misc ${++marker_misc_count}`;

        //TODO(skc): move this to its own function
        //TODO(skc): this needs to be better look up the spec for class names
        //the following code prevents duplicated notes by appending a number
        //to the note if it already exists as a marker
        //how I determin that is by checking if the key already exists
        //in the marker object
        let marker_names = Object.keys(markers);
        let id = notes.replace(/\s/gm,"_").replace(/[\s\(\)->]/gm,"");
        let tid = id;
        let itter = 0;
        let resued_name = marker_names.includes(tid) ;
        if(resued_name) {
            while(marker_names.includes(tid)){
                tid = `${id}_${++itter}`;
            } //this may hang
            id = tid;
            notes = `${notes} ${itter}`;
        }

        //create a markerObject and add it to the markers
        let marker = {TwitchData,ytData,notes};
        markers[id] = marker;
        //TODO(skc): move this to its own function
        //the for attribute technically can only be used on
        //label elements however this is not going to break anything
        let for_attr =`for ="${id}"`;
        //this is the table row for the current marker
        let tr = $(`<tr id="${id}">`);
        //this is the remove button
        let remove = `<input type="button" value = "X" ${for_attr} id = "${id}_remove" class ="remove_marker_btn remove bold">`;
        //this is the modify button
        let modify = `<input type="button" value = "C" ${for_attr} id = "${id}_modify" class ="modify_marker_btn modify bold">`;
        //append everything to the table row for the current marker
        tr.append(`<td class = "twitch_data data"><input type="text"  id="${id}_twttc" class ="twttc" value ="${TwitchData}" /> </td>`)
        tr.append(`<td class = "yt_data data"><input type="text"  id="${id}_yttc" class ="yttc"  value ="${ytData}" /> </td>`)
        tr.append(`<td class ="notes" >${notes}</td>`)
        console.log({remove, modify})
        tr.append(`<td>${remove}${modify}</td>`)
        //append the current row to the table
        marker_table_body.append(tr);
		//since we added a marker we need to update them.
        updateMarkers();
}






function removeMarker(id){
   console.log(id); 
    $(`#${id}`).remove();
    delete markers[id]; 
}


marker_table_body.empty();
$("#markers").on("click", ".remove_marker_btn", (e)=> {
    let el = $(`#${e.target.id}`);
    console.log(e.target.id);  
    let target = el.attr("for");
    console.log(target); 
    removeMarker(target); 
    updateMarkers(); 
})
$("#markers").on("click" , ".modify_marker_btn", (e)=>{ 
    let self = $(`#${e.target.id}`); 
    let target = self.attr("for"); 
    let elements = self.parent().parent().children(); 
    for(let elm  of elements){ 
        let data_type = elm.classList[0]; 
        if( data_type =="twitch_data"){ 
            markers[target].TwitchData = elm.children[0].value;
        }else if(data_type == "yt_data") {
            markers[target].ytData = elm.children[0].value; 
        }
    }
    updateMarkers(); 
})