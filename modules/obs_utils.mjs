async function ChangeSceneCollection( res, obs, targetSeneCollection){
	try {
		await obs.call("SetCurrentSceneCollection", {
				sceneCollectionName: targetSeneCollection,
			});

			return true;
		}
		catch(e){ 
			let resp = `unable to set scene collection ${e}`; 
			console.log(resp)
			json_error(res, resp);
			return false; 
		}
} 

async function centertoScreen(res, obs, scene, sceneItem){ 
	let transform = sceneItem["sceneItemTransform"];
	let { baseWidth, baseHeight } =
		await obs.call("GetVideoSettings");
	let { width, height, scaleX, ScaleY } = transform;
	let xpading = baseWidth - width;
	let ypading = baseHeight - height;

	transform.boundsHeight = height;
	transform.boundsWidth = transform["sourceWidth"];
	transform["positionX"] = xpading / 2;
	transform["positionY"] = ypading / 2;
	console.log(transform); 
	try{ 

		await obs.call("SetSceneItemTransform", {
			sceneName: scene,
			sceneItemId: sceneItem.sceneItemId,
			sceneItemTransform: transform,
		});
		return true; 
	} catch(e){ 
		console.log(e); 
		return false; 
	}
}
function filterOutPutList(outputs){ 
    let ret = []; 
    for (const output of outputs) {
        // output.outputKind != 'replay_buffer'
        let kind = output.outputKind;
        if (
            !(
                kind == "replay_buffer" ||
                kind == "virtualcam_output" || 
				kind == "audio"
            )
        ) {
            ret.push(output); 
        }
    }
    return ret; 
}
async function changeScene(res, obs, targetscene) { 
	try{ 
	
		await obs.call("SetCurrentProgramScene", {
			sceneName: targetscene,
		});
	} catch (e) {
		json_error(res, JSON.stringify(e)); 
	}
}
async function GetOutputList(res, obs ){ 
	return await obs.call("GetOutputList");
}
async function getcurrentTransition(res,obs){ 
	try {
		return obs.call("GetCurrentSceneTransition");
	}
	catch(e){ 
		console.error(e); 
		return false; 
	}
}
export let obs = { 
    ChangeSceneCollection,
    centertoScreen,
    filterOutPutList,
    changeScene,
    GetOutputList,
    getcurrentTransition
}