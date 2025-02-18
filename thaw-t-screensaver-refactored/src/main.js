    import { getRandomColor } from "./utils.js"; 
    import { getRandomInt } from "./utils.js";
    import { drawRectangle } from "./canvas-utils.js";
    import { drawArc } from "./canvas-utils.js";
    import { drawLine } from "./canvas-utils.js";

		let ctx;
		let canvas;
		let paused = false;
        let createRectangles = true;
        let createArcs = true;
        let createLines = true;

		const init = () =>{

			console.log("page loaded!");
			// #2 Now that the page has loaded, start drawing!
			
			// A - `canvas` variable points at <canvas> tag
			canvas = document.querySelector("canvas");
			
			// B - the `ctx` variable points at a "2D drawing context"
			ctx = canvas.getContext("2d");
			
			// C - all fill operations are now in red
			ctx.fillStyle = "red"; 
			
			// D - fill a rectangle with the current fill color
			//ctx.fillRect(20,20,600,440); 

			setupUI();
			update();
		}

		const drawRandomRect = (ctx) =>{
			drawRectangle(ctx,getRandomInt(0,640),getRandomInt(0,480),getRandomInt(10,20),getRandomInt(10,40), getRandomColor(),getRandomInt(2,12),getRandomColor());
		}

		const drawRandomArc = (ctx) =>{
            drawArc(ctx,getRandomInt(0,640),getRandomInt(0,480), getRandomInt(10,14),getRandomColor(),getRandomInt(2,5),getRandomColor());
        }

        const drawRandomLine = (ctx) =>{
            drawLine(ctx,getRandomInt(0,640),getRandomInt(0,480),getRandomInt(0,640),getRandomInt(0,480),getRandomInt(1,10),getRandomColor());
        }

		const update = () =>{
			if(paused == true) return;
			requestAnimationFrame(update);
			if(createRectangles) drawRandomRect(ctx);
			if(createArcs) drawRandomArc(ctx);
            if(createLines) drawRandomLine(ctx);
		}

		function canvasClicked(e) {
			let rect = e.target.getBoundingClientRect();
			let mouseX = e.clientX - rect.x;
			let mouseY = e.clientY - rect.y;
			console.log(mouseX, mouseY);
			for(let i = 0; i < 10; i++ ){
                let x = getRandomInt(-50,50) + mouseX;
                let y = getRandomInt(-50,50) + mouseY;
                let radius = getRandomInt(5,7);
                let color = getRandomColor();
                drawArc(ctx,x,y, radius, color);
            }
		}
	
		const setupUI = () =>{
			document.querySelector("#btn-Pause").onclick = function(){
				paused = true;
			}

			document.querySelector("#btn-Play").onclick = function(){
				if(paused == true){
					paused = false;
					update();
                    console.log("true")
				}
			}

            document.querySelector("#btn-Clear").onclick = () =>{
				ctx.clearRect(0,0,canvas.width,canvas.height);
			}

			canvas.onclick = canvasClicked;

            document.querySelector("#cb-Rectangles").onclick = (e) =>{
				createRectangles = e.target.checked;
			}

            document.querySelector("#cb-Arcs").onclick = (e) =>{
				createArcs = e.target.checked;
			}

            document.querySelector("#cb-Lines").onclick = (e) =>{
				createLines = e.target.checked;
			}

		}

       init();