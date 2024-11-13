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

function printStats(stats){
	let tg = stats.wins+stats.losses;
	let wp = roundp((stats.wins/tg) * 100,2); 
	let lp = roundp((stats.losses/tg) * 100,2); 
	let dckpnts = 2*stats.wins-stats.losses; 
	if(tg == 0) { 
		wp =0; 
		lp = 0;  
	}
	let winlossstr =`${stats.wins} - ${stats.losses} (${tg}) \n`;
	winlossstr += `${wp}% - ${lp}%\n`;
	winlossstr += `total match points ${dckpnts}`; 
	$("#wl_text").html(winlossstr.replace(/\n/gm,"<br>")); 
	
	
}

function UpdateSceneCollection() {
    $("#to_scene").empty();
	$.get("/GSC", (data) => {
		for (scene of data["sceneCollections"]) {
			$("#to_scene").append(`<option value = "${scene}"> ${scene}</option>`);
		}
	});
}
