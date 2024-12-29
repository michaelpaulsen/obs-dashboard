import { readFile } from "node:fs/promises";
import { skcUtils } from "./util.mjs";
async function getFileContent(u){
	try{
		let url = `${u}`;
		const filePath = new URL(url, import.meta.url);
		return  await readFile(filePath, { encoding: "utf8" });
	}catch (e){
		return false;
	}

}
async function fetchJavaScript(res, pathstr, base){
	let contents = await getFileContent(`${base}${pathstr}`);
	//return;
	if(contents !== false){
		res.writeHead(200, { "Content-Type": "text/javascript" });
		res.write(contents);
		res.end();
		return;
	}
//	return;

	res.writeHead(404, { "Content-Type": "text/plain" });
	res.end("unable to find javascript file");
	return;
}
export async function fetchHtml(res, pathstr, base ){
	if(base === undefined) {
		console.trace("no base passed to fetchHtml");
		//if there's no base to add the req url to then we should give a trace
		//so that it can be fixed.
	}
	let contents = await getFileContent(`${base}/${pathstr}`);
	if(contents !== false){
		try {
			res.writeHead(200, { "Content-Type": "text/html" });
			res.write(contents);
			res.end();
			return;
		} catch (e) {

		}
	}
	try{

		res.writeHead(404, { "Content-Type": "text/html" });
		res.write("<html>");
		res.write("<head>");
		res.write("<title> 404 page not found </title>");
		res.write("</head>");
		res.write("<body>");
		res.write("<h1> 404 page not found </h1>");
		res.write(`<hr/><p> the page ${pathstr} is not found on this server </p>`);
		res.write("</body>");
		res.write("</html>");
		res.end();
		res.writeHead(200, { "Content-Type": "text/html" });
		res.write(contents)
		res.end();
	}catch(e){
		console.error(e);
	}

}
async function fetchCSS(res, pathstr, base){
	let contents = await getFileContent(`${base}${pathstr}`);
	//return;
	if(contents !== false){
		res.writeHead(200, { "Content-Type": "text/css" });
		res.write(contents);
		res.end();
		return;
	}
//	return;

	res.writeHead(404, { "Content-Type": "text/plain" });
	res.end("unable to find javascript file");
	return;
}


function handleContentRequest( res, req, base){
	let url = req.url;
	// if url is just a directory assume that they are looking for
	//that dir's index page

	let subdir = skcUtils.getSubDir(req);
	//NOTE (skc) : this may throw? I used to have this in a try catch block...
	if (subdir == "js") {
		File_utils.fetchJavaScript(res,`${url}`,base);
		return;
	}

	if(subdir == "css" || subdir == "style") {
		fetchCSS(res, url, base);
		return;
	}
	//since this is a development enviroment this we are
	//never returning content in this block
	//TODO(skc): add favicon support
	if (req.url == "favicon.ico") {
		res.writeHead(200, { "content-type": "image/icon" });
		res.end();
		return;
	}


	//if we're at this point it is safe to assume that the request is looking
	//html content...

	fetchHtml(res, "html/index.html", base);
	return
}

export const File_utils = {
	getFileContent,
	fetchHtml,
	fetchJavaScript,
	fetchCSS,
	handleContentRequest
}
