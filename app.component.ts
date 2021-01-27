import { Component, OnInit, ViewChild, ElementRef,AfterViewInit } from '@angular/core';

import { fabric } from 'fabric';

export class Cat48Data{
  x=0;
  y=0;
  name='';
  constructor(x,y,ac){
    this.x=x;
    this.y=y;
    this.name=ac
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls :['./app.component.scss']
})
export class AppComponent implements OnInit {

  private canvas :any;
  private canvasWidth=1260;
  private canvasHeight=600;
  private zoomLevel:number=.02;
  private cat48Data:Array<Cat48Data>;

  constructor (
    
  ) {}

  ngOnInit() {
    this.canvas = new fabric.Canvas('canvas');
    this.canvas.setDimensions({width:this.canvasWidth,height:this.canvasHeight});
    this.makeLines();
    this.horizonalMiddleBox();
    this.drawAxisLevels();
    this.designAzimuthArea();
    this.cat48Data=new Array<Cat48Data>();
    this.cat48Data.push(new Cat48Data(1000,110,'ac1'))
    this.cat48Data.push(new Cat48Data(950,105,'ac2'))
    this.showAcMovements(this.cat48Data);
    /*
    this.canvas.getObjects().forEach(element => {
      console.log(element) 
    });*/
  }

  makeLines(){
    let line1= this.makeLine([ 25, this.canvasHeight/2-40, this.canvasWidth/2+15, this.canvasHeight/2-140]);
    this.canvas.add(line1); 
    this.canvas.add(new fabric.Line([25, this.canvasHeight/2-40, this.canvasWidth, this.canvasHeight/2-40], {
      strokeWidth:2,
      fill: 'yellow',
      stroke : 'red',
      selectable :false,
      evented: false,
  }));
  
  
  }
  private showAcMovements(cat:Array<Cat48Data>){
    let listnwew= new Array<Cat48Data>();
    cat.forEach(xyElement=>{

      let x=xyElement.x;
      let y=xyElement.y;
      let ac=xyElement.name
      console.log(x,y)
      let acCircle = new fabric.Circle({
        radius: 20, name: ac, fill: 'green', selectable :false, left: x, top: y+50
      });
      this.canvas.getObjects().filter(x=> x.get('name')===ac).forEach(element => {
        this.canvas.remove(element);
      });
      this.canvas.add(acCircle);
      let selObj=this.canvas.getActiveObject();
      if(selObj!==undefined){
        this.canvas.getObjects().filter(x=>x!==selObj && x.get('name')==='grpLable').forEach(element => {
          this.canvas.remove(element);
          x=selObj!==null?selObj.left:x;
          y=selObj!==null?selObj.top:y;
          this.canvas.remove(selObj);
        });
      }
      else{
      this.canvas.getObjects().filter(x=>x.get('name')==='grpLable').forEach(element => {
        this.canvas.remove(element);
      });
    }
      var rect = new fabric.Rect({
        width: 50, height:80, fill: 'brown'
      });
      let cat48Data=xyElement;

      x=x-Math.random();
      y=y-Math.random()+Math.random();
      cat48Data.x=x;
      cat48Data.y=y;
      listnwew.push(cat48Data);
      let t= new fabric.Text(Math.floor(x)+"\n"+Math.floor(y),{fontSize:19})
      let g= new fabric.Group([rect,t],{name:'grpLable',left :x, top:y-80});
      this.canvas.add(g);
      this.canvas.requestRenderAll();
      fabric.util.requestAnimFrame(()=>this.showAcMovements(listnwew));
      //requestAnimationFrame(()=>this.makeLines(x,y));
    });
  

  }
  public horizonalMiddleBox(){
    this.canvas.add(new fabric.Rect({
      width: this.canvasWidth,
      height: 25,
      left :0,
      selectable :false,
      evented: false,
      top:this.canvasHeight/2,
      fill: "blue",
      stroke: "yellow",
      strokeWidth: 2
  }));


  }
  private makeLine(coordinates){
    return new fabric.Line(coordinates, {
      fill: 'red',
      stroke: 'red',
      strokeWidth: 1,
      selectable: false,
      evented: false,
    });
  }
  private designAzimuthArea(){
    let lineUpperAngle=   new fabric.Line([25, this.canvasHeight*.75+10, 700, this.canvasHeight], 
      { strokeWidth:2,
      fill: 'yellow',
      stroke : 'red',
      selectable :false,
      evented: false,
    });

    let lineLowerAngle=   new fabric.Line([25, this.canvasHeight*.75+10, 700, this.canvasHeight/2+15], 
      { strokeWidth:2,
      fill: 'yellow',
      stroke : 'red',
      selectable :false,
      evented: false,
    });


    let innerLowerSlaintLine=   new fabric.Line([25, this.canvasHeight*.75+10, 300, this.canvasHeight*.82], 
      { strokeWidth:2,
      fill: 'yellow',
      stroke : 'yellow',
      selectable :false,
      evented: false,
    });

    let innerUpperSlaintLine=   new fabric.Line([25, this.canvasHeight*.75+10, 300, this.canvasHeight*.72], 
      { strokeWidth:2,
      fill: 'yellow',
      stroke : 'blue',
      selectable :false,
      evented: false,

    });

    let lineHorizwithLower=   new fabric.Line([innerLowerSlaintLine.x2, this.canvasHeight*.72, this.canvasWidth/2+150, this.canvasHeight*.72], 
      { strokeWidth:2,
      fill: 'yellow',
      stroke : 'red',
      selectable :false,
      evented: false,
    });

    let lineHorizWidUpper=   new fabric.Line([innerUpperSlaintLine.x2, this.canvasHeight*.82, this.canvasWidth/2+150, this.canvasHeight*.82], 
    { strokeWidth:2,
    fill: 'yellow',
    stroke : 'red',
    selectable :false,
    evented: false,
  });

  let lineCentralHozi=   new fabric.Line([innerUpperSlaintLine.x1, this.canvasHeight*.75+10, this.canvasWidth/2+150, this.canvasHeight*.75+10], 
    { strokeWidth:2,
    fill: 'yellow',
    stroke : 'red',
    selectable :false,
    evented: false,
  });


    this.canvas.add(lineUpperAngle,lineLowerAngle,innerUpperSlaintLine,innerLowerSlaintLine,lineHorizwithLower,lineHorizWidUpper,lineCentralHozi)
  }


  public zoomOut(){
    console.log(this.canvas.getZoom())
    if(this.canvas.getZoom()<1.06){
      this.canvas.setZoom(this.canvas.getZoom()+this.zoomLevel);
      this.canvas.setWidth(this.canvasWidth / this.canvas.getZoom());
      this.canvas.setHeight(this.canvasHeight /this.canvas.getZoom());
      this.drawAxisLevels();
    }
  }
  public zoomIn(){
    console.log(this.canvas.getZoom())
    if(this.canvas.getZoom()>1){
    this.canvas.setZoom(this.canvas.getZoom()-this.zoomLevel);
    this.canvas.setWidth(this.canvasWidth / this.canvas.getZoom());
    this.canvas.setHeight(this.canvasHeight /this.canvas.getZoom());
    this.drawAxisLevels();
    }
  }
  private drawAxisLevels(){

    this.canvas.getObjects().filter(x=>x.get('name')==='yaxis').forEach(element => {
      this.canvas.remove(element);
    });


      var range=this.canvasWidth/20;
      var rangeLable=0;
      for (var x = 0; x <= this.canvasWidth; x += range) {
        rangeLable++;
        let t=new fabric.Text(rangeLable+"",{selectable :false, evented: false,fontSize:18,left:x+10,top:this.canvasHeight/2});
        this.canvas.add(t);
        
      }
      var elevationRange=(this.canvasHeight/2-10)/8;
      //console.log(elevationRange, this.canvasHeight,this.canvas.getZoom())
      var elevationLabels=0;
      for (var x = 0; x<= this.canvasHeight/2; x += elevationRange ){
        let t=new fabric.Text(Math.floor((this.canvasHeight/2-x)/this.canvas.getZoom())+"",{selectable :false, evented: false,name:'yaxis',fontSize:18,left:0,top:x});
        this.canvas.add(t);
      }

      var azimuthRangePositive=(this.canvasHeight*.75)/5;
      for (var x = this.canvasHeight/2; x<= this.canvasHeight*.75; x += azimuthRangePositive ){
        let t=new fabric.Text(Math.floor((this.canvasHeight*.75-x)/this.canvas.getZoom())+"",{selectable :false, evented: false,name:'yaxis',fontSize:18,left:0,top:x});
        this.canvas.add(t);
      }

      var azimuthRangeNegative=(this.canvasHeight*.75)/5;
      for (var x = this.canvasHeight*.75; x<= this.canvasHeight; x += azimuthRangeNegative ){
        let t=new fabric.Text(Math.floor((this.canvasHeight*.75-x)/this.canvas.getZoom())+"",{selectable :false, evented: false,name:'yaxis',fontSize:18,left:0,top:x});
        this.canvas.add(t);
      }
  }
}