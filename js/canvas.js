function Canvas(el){
    canvas = $(`#${el}`); 
    obj = {
        elem : canvas
    }
    //size of the canvas
    obj.w = canvas.innerWidth(); 
    obj.h = canvas.innerHeight(); 
    
    //the 2d rendering context associated with the canvas
    obj.ctx = obj.elem[0].getContext("2d"); 
    
    //fill and stroke styles
    obj.strokeStyle = obj.ctx.strokeStyle;
    obj.fillStyle = obj.ctx.fillStyle; 


    //the text align
    obj.textStyle = obj.ctx.font;  
    obj.textAlignStyle = obj.ctx.textAlign;
    //draw an unfilled rect
    obj.rect = (x,y,w,h) => { 
        obj.ctx.strokeRect(x,y,w,h); 
    };
   
    obj.stroke = (color) =>{ 
        obj.ctx.strokeStyle = "rgba(0,0,0,0)";
        obj.s = color; 
    }
    obj.fill = (color) =>{ 
        obj.ctx.fillStyle = color;
        obj.f = color;
        obj.update(); 
    }
    obj.nostroke =() =>{ 
        obj.ctx.strokeStyle = "rgba(0,0,0,0)";
        obj.update();
    }
    obj.fillRect = (x,y,w,h)=> { 
        obj.ctx.fillRect(x, y, w, h)
    }
    obj.clear = () => { 
        //clearRect(0, 0, obj.w, obj.h);
        obj.update()
    }    

    obj.text = (str, x, y, mw = 120) => { 
        obj.ctx.fillText(str, x, y, mw)
    }
    obj.font = (size, font) => { 
        obj.ctx.font = `${size} ${font}`;
        obj.update();  
    }
    obj.isValidTexAlignSetting = (ta)=> {
        let isValid = ta === "left";
"right";
        return isValid  || ta === "center"|| ta === "start" || ta === "end";
    }
    obj.textAlign = (ta) => { 
        if(!obj.isValidTexAlignSetting(ta)) return; 
        obj.ctx.textAlign = ta;
        obj.update(); 
    }
    obj.update = ()=>{

        obj.h = obj.elem.innerHeight()
        obj.w = obj.elem.innerWidth()
        obj.strokeStyle = obj.ctx.strokeStyle;
        obj.fillStyle = obj.ctx.fillStyle; 
        obj.textStyle = obj.ctx.font;  
        obj.textAlignStyle = obj.ctx.textAlign;        
    } 

    return obj;
}