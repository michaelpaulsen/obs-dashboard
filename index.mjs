import { createServer } from "node:http";
import OBSWebSocket from "obs-websocket-js";
import {skc_settings} from "./modules/settings.mjs"
import {skcUtils}from "./modules/util.mjs"
import { File_utils} from "./modules/readFile.mjs";
let base = `file://${import.meta.dirname}`;
let mtg_stats = { 
	wins: 0,
	losses : 0
}

async function changeText(res,target,  text) { 
	if(!await connect(res)){
		return; 
	} 
	try {
		let { inputSettings } = await obs.call("GetInputSettings", {
			inputName: target,
		});
		inputSettings.text = `${text}`;
		await obs.call("SetInputSettings", {
			inputName: target,
			inputSettings: inputSettings,
		});
		await disconnect();
		return;
	} 
	catch(e) { 
		skcUtils.json_error(res, JSON.stringify(e));
	}
	return; 
}
function mtg_update(res) { 
	let total = mtg_stats.wins + mtg_stats.losses;
	let winpercent  = Math.round(100 * (100*(mtg_stats.wins/total)))/100;
	let losspercent = 100 - winpercent;   
	let text = `${mtg_stats.wins}-${mtg_stats.losses} (${total})\n`;
	text +=  `${winpercent}% - ${losspercent}%`
	changeText(res,"wl text", text); 
	try {
		res.writeHead(200,{"content-type" : "text/json"});
		res.end(JSON.stringify(mtg_stats))
	}catch(e){ }; 
}
//the OBS websocket connection object
const obs = new OBSWebSocket();
let connected =false; 


async function getTimeCodes(res, obs){ 
	let outputs = (await skcUtils.obs.GetOutputList(res,obs)).outputs;
	let tc = {};
	for(let output of outputs){
		let name = output.outputName
		let data = {};

		let status = await obs.call("GetOutputStatus", {
			outputName: name,
		});
		data["status"] = status.outputActive
			? "active"
			: "inactive";
		data["timeCode"] = status.outputTimecode;
		tc[name] = data;
	}
	if(tc == undefined){
		let o = {
			"error" : "no streams found"
		}
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify(o));
		return false;

	}
	return tc; 
}
async function connect(res){ 
	if(connected)
	 {
		console.log('allready connected')
		return true;
	 }  
	try {

		await obs.connect("ws://127.0.0.1:4455", skc_settings.OBS_PASSWORD, {
			rpcVersion: 1,
		});	
		connected =true; 
		return true; 
	} catch(e){
		
		connected = false; 
		skcUtils.json_error(res, `unable to connect to obs ${JSON.stringify(e).replace(/"/gm, "`")}`); 
		return false; 
	}
}

async function disconnect(){ 
	connected = false; 
	await obs.disconnect();
}

createServer(async function (req, res) {
	let search = req.url.split("?")[1];

	//see the utils modual
	let get = skcUtils.parseQueryString(search);

	
	//is the root of this mjs file
	let subdir = skcUtils.getSubDir(req); 


	//for now if the client requests the favicon then 
	//ignore the request 
	//TODO: add favicon support
		
	//changes the target text source's text
	//expects get -> target 
	//        get -> text
	if(subdir == 'textChange') {
		changeText(res, get["target"], get["text"]); 
		return;  
	}
	if(subdir == "mtg_win") { 

		++mtg_stats.wins;
		mtg_update(res);
		
		return;  
	}
	if(subdir == "mtg_loss") { 
		++mtg_stats.losses;
		mtg_update(res);
		return;  

	}
	//changes the scene collection to get.scene and changes the the input named
	// reason text to get.reason
	// expects get -> target
	//         get -> reason
	if (subdir == "changeSceneCollection") {
		let inputname = "reason text";
		let insettings = {};
		let si;

		if(!await connect(res)) {
			console.error(`${subdir} unable to connect obs`);
			return;
}
		let sc = await skcUtils.obs.GetSceneCollectionList(obs) ;
		let timeCodes = await getTimeCodes(res, obs);
		let currentScene = sc["currentSceneCollectionName"];
		let data = {timeCodes, currentScene};
		let ct = await skcUtils.obs.getcurrentTransition(res,obs);
		let transitionms = 1200;

		if(!skcUtils.obs.ChangeSceneCollection(res,obs,get["target"])) return;
			setTimeout(
			async (e)=>{
				try {
					let { inputSettings } = await obs.call("GetInputSettings", {
						inputName: inputname,
					});
					try {
						insettings =inputSettings;
						insettings.text = `${get["reason"]}`;
						await obs.call("SetInputSettings", {
							inputName: inputname,
							inputSettings: insettings,
						});
					} catch(e){
					}

				} catch(e){
				}
				setTimeout( async ()=> {
					try{
						let { sceneItems } = await obs.call("GetSceneItemList", {
								sceneName: skc_settings.defaultSceneName,
							});
						for (let sceneItm of sceneItems) {
							if (sceneItm["sourceName"] === inputname) {
								si = sceneItm;
							}

						}
						await skcUtils.obs.centertoScreen(res, obs, skc_settings.defaultSceneName, si);
						await skcUtils.obs.changeScene(res, obs, skc_settings.defaultSceneName);
					} catch(e){
					}


					await disconnect();
					if(data) {
						res.writeHead(200, { "Content-Type": "application/json" });
						res.end(JSON.stringify(data));
					}
				}, transitionms)
			}, transitionms);
		return;
	}
	//gets the scene collection list 
	if (subdir == "GSC") {
		let sceneCollections;
		if(!await connect(res)){ 
			
			console.error(`${subdir} unable to connect obs`);
			return;
		}
		try {
				let sc = await obs.call("GetSceneCollectionList");
				sceneCollections = sc; 

			await disconnect();
		} catch (e) {
			console.error(e); 
			let jserror = JSON.stringify(e).replace(/"/gm,"`"); 
			skcUtils.json_error(res,`unable to get SceneColection ${jserror}`);
			return;  
		}

		let jsn_resp; 
		try{ 
			jsn_resp = JSON.stringify(sceneCollections); 

		} catch(e){
			json_error(res, "-- internal server error -- \n unreachable error");
			process.abort(); 
		}
		res.writeHead(200, { "Content-Type": "application/json" });
		res.write(jsn_resp);
		res.end();
		return;
	}

	//returns a list of all of the output streams' time codes
	//and if those streams are active
	// in the form name:{timeCode:time code, status : "[active | inactive]"}
	if (subdir == "addMarker") {
		if(!await connect(res)){
			console.error(`${subdir} unable to connect obs`);
			return;
		}
		let data = await getTimeCodes(res, obs);
		await disconnect();
		if(data) {
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify(data));
		}
		return;

	}

	//if we get to this point then we're not processing an API end point so the 
	//client must be requesting content
	//since I know the layout of the app, for security resons I can check for the sub dir
	//rather than just allowing everything in
	File_utils.handleContentRequest(res,req, base); 

	
}).on('connection', function(socket) {
	socket.setTimeout(3000);
}).listen(8080);


createServer( (req,res)=> {
	let search = req.url.split("?")[1];

	//see the utils modual
	let get = skcUtils.parseQueryString(search);

	//is the top level subdir of the request
	let subdir = req.url.split("/")[1];
	let rurl = req.url; 
	if(subdir == "winlossState"){
		res.writeHead(200,{"content-type" : "text/json"})
		res.end(JSON.stringify(mtg_stats));
		return; 

	}
	try{ 
		File_utils.handleContentRequest(res,req,base, 2); 

	} catch(e){ }
	return; 
}).listen(8081); 