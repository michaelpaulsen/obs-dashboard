let markers = {};
let marker_table_body = $("#markers tbody");
let marker_misc_count = 0;
let marker_max_markers_of_same_name = 10;

//this is a small helper to make the table creation code more readable
//SEE: addMarker [this document] =]
function makeTimeCodeTableData( outterClass, innerClass, value){
    let ret = `<td class = "${outterClass} data">`;
    ret += `<input class = "${innerClass}" value = "${value}"/>`;
    return ret + `</td>`;
}

//dispays the markers
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
function makeMarkerTableRow(id, TwitchData, ytData, recordingData, notes){
    //NOTE: the for attribute technically can only be used on
    //label elements however this is not going to break anything
    let for_attr =`for ="${id}"`;
    //this is the table row for the current marker
    let tr = $(`<tr id="${id}">`);
    //this is the remove button
    let remove = `<input type="button" value = "X" ${for_attr} id = "${id}_remove" class ="remove_marker_btn remove bold">`;
    //this is the modify button
    let modify = `<input type="button" value = "C" ${for_attr} id = "${id}_modify" class ="modify_marker_btn modify bold">`;
    //append everything to the table row for the current marker
    tr.append(makeTimeCodeTableData("TwitchData", "twttc", TwitchData));
    tr.append(makeTimeCodeTableData("ytData", "yttc", ytData));
    tr.append(makeTimeCodeTableData("recordingData", "rectd", recordingData));
    //TODO(skc): make this modifiable
    tr.append(`<td class ="notes" >${notes}</td>`)
    tr.append(`<td>${remove}${modify}</td>`)
    //append the current row to the table
    marker_table_body.append(tr);

}

function updateMarkers(){
	let output = $("#markers_output");
	output.empty();
    output.append("--Twitch--\n");
    PrintMarkerData(output, "TwitchData");
	output.append("--YT--\n");
    PrintMarkerData(output,"ytData");
    output.append("--recording--\n");
    PrintMarkerData(output,"recordingData");

}

//this takes the time code response from the server and makes
//a marker out of it
//the server gives a JSON encoded array of output objects
//the output Objects are in the form {status -> string, timecode -> string}
//NOTE: status is one of inactive or active and could be used to mark if
//a stream is active

function addMarker(notes, d){
    //NOTE: the name of the output may change this is just the way I have it
    //this may need to be changed for you!
    //TODO: I bet that the name can be determined algorithmicly write
    //write something to do that
    let TwitchData = d["aitum_multi_output_Twitch Output"];
    let ytData = d["adv_stream"];

    //this seems to be the file output this seems to exist even when not
    //active which means that we don't need check if it is there
    let recordingData = d["adv_file_output"]["timeCode"].split(".")[0];

    //NOTE: it seems that when inactive the stream outputs
    //are not in the list of outputs so we make sure that they are  defined
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

    //if you add an empty note then YT doesn't like it so
    //this sets a default note for the marker if there's not one already
    if(notes == "" || notes == " " ) notes = `misc ${++marker_misc_count}`;

    //TODO(skc): move this to its own function

    //NOTE: the following code prevents duplicated notes by appending a number
    //to the note if it already exists as a marker
    //how I determin that is by checking if the key already exists
    //in the marker object
    let marker_names = Object.keys(markers);
    let id = notes.replace(/\s/gm, "_").replace(/[^_A-Za-z\d]/gm, "");
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
    let marker = {TwitchData,ytData,recordingData, notes};
    markers[id] = marker;
    makeMarkerTableRow(id, TwitchData, ytData, recordingData, notes);

    //since we added a marker we need to update them.
    updateMarkers();
}






function removeMarker(id){
    $(`#${id}`).remove();
    delete markers[id];
}


marker_table_body.empty();
$("#markers").on("click", ".remove_marker_btn", (e)=> {
    let el = $(`#${e.target.id}`);
    let target = el.attr("for");
    removeMarker(target);
    updateMarkers();
})

//update the markers when the marker's modify_marker_btn is clicked!
//FIXME(skc): there has to be a better way to do this
$("#markers").on("click" , ".modify_marker_btn", (e)=>{
    let self = $(`#${e.target.id}`);
    let target = self.attr("for");
    let elements = self.parent().parent().children();
    let mTarget = markers[target];
    for(let elm  of elements){
        let data_type = elm.classList[0];
        if(elm.children[0] !== undefined){
            mTarget[data_type] = elm.children[0].value;
        }
    }
    updateMarkers();
});
