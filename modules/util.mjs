import {obs} from "./obs_utils.mjs"


function json_error(res, messsage, code = 500) {
	res.writeHead(code, {
		"Content-Type": "application/json"
	});
	res.write(`{"error": "${messsage}"}`);
	res.end();
}

//this parses a request's url and then returns the subdir of the target
//resource
function getSubDir(req) {
	//if the url is just / then we want to assume the user wanted HTML content
	//because there's no valid API endpoint at /
	//NOTE(skc) : this should never not be the case but if it isn't
	//then this is a bug...
	if (req.url == "/") return "html";
	//if the requested url is not / then we should parse the file
	//is the top level subdir of the request


	//NOTE(skc): req.url is something like "/html/test.html"
	//this gets the html
	let subdir = req.url.split("/")[1];

	//the user can pass query strings while passing a directory
	//this handles that by only taking the first item
	//NOTE(skc) : if the folder includes a ? then this is buged
	//though I don't think that that is well formed anyway
	if (subdir.includes("?")) {
		subdir = subdir.split("?")[0];
	}
	return subdir;
}

function parseQueryString(search) {
	let query = {};
	if (search == undefined) return {};
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
try {
	skcUtils.obs = obs;
} catch (e) {}
