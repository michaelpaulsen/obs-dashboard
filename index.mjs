//node's built in HTTP modual
import {createServer} from "node:http";
//a modual to interface with OBS
import OBSWebSocket from "obs-websocket-js";
//some util functions 
import {skcUtils} from "./modules/util.mjs"
//some file spisiphic utils
import {File_utils} from "./modules/readFile.mjs";
//the base URI of the modual 
//FIXME(skc) : this may not be nessisary... 
let base = `file://${import.meta.dirname}`;
//the port that the server listens to 
const PORT =8080; 
//the OBS websocket connection object
const obs = new OBSWebSocket();
//a function to help connect to obs 
async function connect() {
	//since OBS can throw we need to wrap it in a try catch block 
	try {
		//NOTE(skc): if you use a password on your obs websock[which you should] you will need to edit
		//this... 
		await obs.connect("ws://127.0.0.1:4455", "password", {
			rpcVersion: 1,
		});
		return true;
	} catch (e) {
		console.error(e);
		return false;
	}
}

//this is just a alias 
//I don't know if this could throw but better safe than sorry. 
async function disconnect(){
	try{ 
		await obs.disconnect();
	}catch(e){ 
	
	}
}
console.clear();
console.log(`listening to localhost on port ${PORT}`);  

createServer(async function (req, res) {
	//get the query string of the URL 
	//TODO (skc) : support POST requests 
	let search = req.url.split("?")[1];
	//see the utils modual
	let get = skcUtils.parseQueryString(search);
	//is the root of this mjs file
	let subdir = skcUtils.getSubDir(req);
	//--- START OF API ENDPOINTS --- 
	
	//changes the scene collection to get.scene and changes the the input named
	// reason text to get.reason
	// expects get -> target
	//         get -> reason
	if (subdir == "changeSceneCollection") {
		//the name of the source that we want to change the text of. 
		let inputname = "reason text";
		//will store the text settings of the text source named ${inputname}
		let insettings = {};
		//stores the actual scene item [source] named ${inputname}
		let scene_item; 
		//connect to obs
		if(!await connect(res)) {
			console.error(`${subdir} unable to connect obs`);
			return;
		}
		//gets the current time code this is used for returning the timestamp for the client to use
		let timeCodes = await skcUtils.obs.getTimeCodes(res, obs);
		
		//get the scene collections
		let scene_collections = await skcUtils.obs.GetSceneCollectionList(obs) ;
		
		//this is the current scene in the scene collection... 
		//as far as I can tell this two step system is the only way to get 
		//the current scene... 
		let currentScene = scene_collections["currentSceneCollectionName"];
		
		//this is the time stamp that would eventually be returned to the client
		let data = {timeCodes, currentScene};
		//NOTE(skc) : how long it takes of the transition to center the text in the current scene
		let transitionms = 1200;
		
		//check if the target scene exists 
		//NOTE(skc) : the way my client works there's no need for this (because the only input is
		// is a drop down generated from OBS's scene collection list.) 
		//but I want to keep this because its more correct 
		if(!skcUtils.obs.ChangeSceneCollection(res,obs,get["target"])) return;
		
		//I don't think there's a better way to do this ... if there is FIXME.
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
					} catch(e){ }
				} catch(e){}
				setTimeout( async ()=> {
					try{
						let { sceneItems } = await obs.call("GetSceneItemList", {
							sceneName: skc_settings.defaultSceneName,
						});
						for (let sceneItm of sceneItems) {
							if (sceneItm["sourceName"] === inputname) {
								scene_item= sceneItm;
							}
						}
						await skcUtils.obs.centertoScreen(res, obs, skc_settings.defaultSceneName, si);
						await skcUtils.obs.changeScene(res, obs, skc_settings.defaultSceneName);
					} catch(e){}
					await disconnect();
					if(data) {
						res.writeHead(200, { "Content-Type": "application/json" });
						res.end(JSON.stringify(data));
					}
				}, transitionms)
			}, transitionms);
		return;
	}
	//GSC stands for Get Scene Collections 
	//this gets the scene collection list (this is used by my client to populate the dropdown
	// used to change the scene..) 
	if (subdir == "GSC") {
		let sceneCollections;
		if(!await connect(res)){
			console.error(`${subdir} unable to connect obs`);
			return;
		}
		
		try {
			let ret = await skcUtils.obs.GetSceneCollectionList(obs);
			sceneCollections = ret;
			await disconnect();
		} catch (e) {
			
			//FIXME(skc): THIS IS DIRTY FIX IT! 
			console.error(e);
			let jserror = JSON.stringify(e).replace(/"/gm,"`");
			skcUtils.json_error(res,`unable to get SceneColection ${jserror}`);
			return;
		}

		let jsn_resp;
		
		//NOTE(skc) I don't think that it is possible for this to fail as it is not 		
		jsn_resp = JSON.stringify(sceneCollections);
		res.writeHead(200, { "Content-Type": "application/json" });
		res.write();
		res.end(jsn_resp);
		return;
	}

	//NOTE(skc) : returns a list of all of the output streams' time codes
	//and if those streams are active
	// in the form name:{timeCode:time code, status : "[active | inactive]"}
	if (subdir == "addMarker") {
		if(!await connect(res)){
			console.error(`${subdir} unable to connect obs`);
			return;
		}
		let data = await skcUtils.obs.getTimeCodes(res, obs);
		await disconnect();
		if(data) {
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify(data));
		}
		return;
	}
	
	//since we're returning from the response before we get to this point 
	//we can just assume that the 
	File_utils.handleContentRequest(res,req, base);


}).listen(PORT);
