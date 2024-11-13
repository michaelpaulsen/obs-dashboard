let c = Canvas("arena_win_loss_graph_canvas"); 
let wins, losses;

function drawStats(x,wh, w = 20){ 
    $.ajax("winlossState",
        {
            success: (d)=>{
                let t  = d.wins + d.losses; 
                let height = d.wins/t;
                if(t == 0){
                    return; 
                }
                height *= c.h;  
                c.fill("#0f9")
                c.fillRect(0,c.h,20,-height); 
                c.fill("#f09")
                c.fillRect(0, c.h - height,20,-(c.h-height));
            },
            error:(e)=>{
            }
            
        }
    );
   
}
    