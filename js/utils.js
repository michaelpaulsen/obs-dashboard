function makeID(str){ 
    
    if(str[0] !== '#') { 
        return `#${str}`; 
    }
    return str; 
}

function toggle(Jqueryel, state1, state2){ 
    let val = Jqueryel.val();
        if(val.toLowerCase() === state1.toLowerCase()){ 
            Jqueryel.val(state2);
            return true; 
        }
        else { 
            Jqueryel.val(state1);
            return false; 
        }
        //assumes that the first state is the true state. 
}

function roundp(value, power){ 
	return Math.floor(value*Math.pow(10,power))/Math.pow(10,power); 
}


function UpdateSceneCollection() {
    $("#to_scene").empty();
	$.get("/GSC", (data) => {
		for (scene of data["sceneCollections"]) {
			$("#to_scene").append(`<option value = "${scene}"> ${scene}</option>`);
		}
	});
}
