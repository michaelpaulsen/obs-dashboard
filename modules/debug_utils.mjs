let DEBUG = true;
function dbgPrint(...msg){ 
	if(DEBUG){
		console.log(msg); 
	}
}
function dbgTrace(...msg){
    if(DEBUG){
        console.trace(msg)
    }
}
function dbgCrashAndBurn(error, ...msg){ 
    if(DEBUG) { 
        console.error(error);
        console.trace(msg);
        process.exit(-1); 
    }
}
export let debug = { 
    dbgPrint,
    dbgTrace,
    dbgCrashAndBurn,
    DEBUG,
}