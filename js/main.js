let prev = "unknown";
let t, render=true; 
let playbtnDefault = $("#record_pause_btn").val(); 
let recordingState = "Inactive";
let writingState = "Inactive"; 
const PPBTN = $("#record_pause_btn"); 
let framerate =30, ff =0, ss =0,mm =0,hh =0, interval, inttime = 1000/framerate, gfc =0; 
let recSymToggles = 0, paused =false; 
let colorRecBTN = false, colorPauseBTN =true; 

$("#btn_add_marker").on("click", () => {
	$.get("/addMarker", (d) => {
		addMarker($("#discription").val(), d);
	});
});

$("#change_scene").on("click", () => {
	let target = $("#to_scene").val(); 
	let reason =   $("#reason").val(); 

	$.ajax({
		url: "/changeSceneCollection",
		data: {
			target,
			reason
		},
		success: (d) => {
			addMarker(`${reason} (${prev} -> ${target})`, d);
			prev = target; 

		},
		method: "GET",
	});
	
});

$("#wl_win").on("click", (e)=>{ 
	$.ajax({
		url: "/mtg_win",
		success: (d) => {
			printStats(d); 
			return;
		},
		method: "GET",
	});

});

$("#wl_loss").on("click", (e)=>{ 
	$.ajax({
		url: "/mtg_loss",
		success: (d) => {
			printStats(d); 
			return;
		},
		method: "GET",
	}); 

})

$("#wl_reset").on("click", (e)=>{ 
	$.ajax({
		url: "/mtg_reset",
		success: (d) => {
			printStats(d); 
			return;
		},
		method: "GET",
	}); 
}); 

$("#refesh_scene_colection").on("click", (e)=> { 
	UpdateSceneCollection();
});

UpdateSceneCollection();
