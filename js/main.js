
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

$("#refesh_scene_colection").on("click", (e)=> {
	UpdateSceneCollection();
});

UpdateSceneCollection();
