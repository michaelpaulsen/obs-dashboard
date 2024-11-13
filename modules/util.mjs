
import {obs} from "./obs_utils.mjs"
import { debug } from "./debug_utils.mjs";
 

function json_error(res, messsage, code = 500) { 
	res.writeHead(code, { "Content-Type": "application/json" });
	res.write(`{"error": "${messsage}"}`);
	res.end();
}

function getSubDir(req){
	if(req.url == "/") return "html"; 
	//is the top level subdir of the request
	let subdir = req.url.split("/")[1];
	
	if(subdir.includes("?")){ 
		subdir = subdir.split("?")[0]; 
	}
	return subdir; 
}
function parseQueryString(search) {
	let query = {};
	if(search == undefined) return {}; 
	let queries = search.split("&");
	for (let q of queries) {
		let qe = q.split("=");
		if (qe[1] == "") {
			query[qe[0]] = true;
			continue;
		}

		query[qe[0]] = decodeURI(qe[1]);
	}
	return query;
}

export const skcUtils = { 
	parseQueryString,
	json_error,
	getSubDir,
}
try{ 
	skcUtils.obs = obs; 
} catch(e){ 
}
try{
	skcUtils.debug = debug; 
}catch(e){};