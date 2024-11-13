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
		let TwitchData = d["aitum_multi_output_Twitch Output"];
		let ytData = d["adv_stream"];
        if(TwitchData == undefined) {
            TwitchData = "00:00:00";
        }else{ 
            TwitchData = TwitchData.timeCode.split(".")[0];
        } 
        if(ytData == undefined) {
            ytData = "00:00:00";
        }else{ 
           ytData = ytData.timeCode.split(".")[0]
        }
        if(notes == "" || notes == " " ) notes = `misc ${++marker_misc_count}`; 

        let marker_names = Object.keys(markers); 
        let id = notes.replace(/\s/gm,"_").replace(/[\s\(\)->]/gm,""); 
        let tid = id; 
        let itter = 0; 
        let resued_name = marker_names.includes(tid) ;
        console.log({resued_name})
        if(resued_name) { 
            while(marker_names.includes(tid)){ 
                tid = `${id}_${++itter}`; 
            }
            id = tid;
            notes = `${notes} ${itter}`;
        }
        let marker = {TwitchData,ytData,notes}; 
        markers[id] = marker;
        let for_attr =`for ="${id}"`; 
        let tr = $(`<tr id="${id}">`); 
        let remove = `<input type="button" value = "X" ${for_attr} id = "${id}_remove" class ="remove_marker_btn remove bold">`;
        let modify = `<input type="button" value = "C" ${for_attr} id = "${id}_modify" class ="modify_marker_btn modify bold">`; 
        tr.append(`<td class = "twitch_data data"><input type="text"  id="${id}_twttc" class ="twttc" value ="${TwitchData}" /> </td>`)
        tr.append(`<td class = "yt_data data"><input type="text"  id="${id}_yttc" class ="yttc"  value ="${ytData}" /> </td>`)
        tr.append(`<td class ="notes" >${notes}</td>`)
        console.log({remove, modify})
        tr.append(`<td>${remove}${modify}</td>`)
        marker_table_body.append(tr); 
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