function makeTimeCodeTableData( outterClass, innerClass, value){
    let ret = `<td class = "${outterClass} data">`;
    ret += `<input class = "${innerClass}" value = "${value}"/>`;
    return ret + `</td>`;
}

function makeMarkerTableRow(id, TwitchData, ytData, recordingData,
                            ytVerticalStream, notes){
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
    tr.append(makeTimeCodeTableData("ytVerticalStream", "vstreamData", ytVerticalStream));
    tr.append(`<td class ="notes" ><input value ="${notes}"/></td>`)
    tr.append(`<td>${remove}${modify}</td>`)
    //append the current row to the table
    marker_table_body.append(tr);

}
marker_table_body.empty();
