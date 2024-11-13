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
		console.error("e");
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


function handleContentRequest( res, req, base, mode = 1){ 
	let url = req.url;
	if(req.url == "/") url = "/html/index.html";  
	let subdir = skcUtils.getSubDir(req); 
	try{
		subdir = skcUtils.getSubDir(req); 
	}catch(e){
		skcUtils.debug.dbgTrace(e);
		fetchHtml(res,"/index.html",base);
		return;  
	}
	if (subdir == "js") {
		File_utils.fetchJavaScript(res,`${url}`,base);
		return;
	}
	if(subdir == "css" || subdir == "style") { 
		fetchCSS(res, url, base);
		return;   
	}
	if (req.url == "favicon.ico") {
		res.writeHead(200, { "content-type": "image/icon" });
		res.end();
		return;
	}
	url = "html/"; 
	if(url.at(-1)== "/"){
		if(mode == 1) { 
			url += "index.html";
		}else{ 
			url += "graph.html"
		}
	}

	fetchHtml(res,`${url}`, base); 
	return
}

export const File_utils = { 
	getFileContent,
	fetchHtml,
	fetchJavaScript,
	fetchCSS,
	handleContentRequest
}