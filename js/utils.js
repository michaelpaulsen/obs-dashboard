//takes an arbitrary string and makes it a CSS Id selector by adding a #
//to the front if there's not one already
function makeID(str){
    if(str[0] !== '#') {
        return `#${str}`;
    }
    return str;
}
function read_checkBox(id){
    return $(`${id}:checked`).val() !== undefined;
    //NOTE (skc) : there *HAS* to be a better way of doing this
}

function UpdateSceneCollection() {
    $("#to_scene").empty();
	$.get("/GSC", (data) => {
		for (scene of data["sceneCollections"]) {
			$("#to_scene").append(`<option value = "${scene}"> ${scene}</option>`);
		}
	});
}
