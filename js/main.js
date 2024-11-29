let t, render=true;
const PPBTN = $("#record_pause_btn");

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
			console.log(d);
			addMarker(`${reason} (${d["currentScene"]} to ${target})`, d["timeCodes"]);
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
