function draw(cobj,canvasBox,copy){
    //将画图的2d对象保存到本对象的属性里面
    this.cobj=cobj;
    //将画图的容器对象保存到本对象的属性里面
    this.box=canvasBox;
    //将copy对象保存到本对象的属性里面
    this.copy=copy;
    this.w=canvasBox.width();
    this.h=canvasBox.height();
    //线条的宽度
    this.lineWidth=1;
    //线条的颜色

    this.lineColor="#000";

    //填充的颜色

    this.fillColor = "#000";

    //记录变化状态的数组

    //画图的类型

    this.type="";

    //画图的方式

    this.style="stroke";

    this.arr=[];

    this.size=5;
    this.xiangpi=this.createxp();

    /*创建选择框（div）*/

    this.sx=0;
    this.sy=0;
    this.sw=0;
    this.sh=0;
    this.s=this.createS();


}

draw.prototype= {
    //初始化图形的样式
   init:function(){
       this.s.css("display","none")
       //设置线条的宽度
       this.cobj.lineWidth=this.lineWidth;
       //设置线条的颜色
       this.cobj.strokeStyle=this.lineColor;
       //设置填充的颜色
       this.cobj.fillStyle=this.fillColor;
   },

   drawFun:function(){
       var that=this;
       that.copy.onmousedown=function(e){
       //橡皮隐藏
           that.xiangpi.css("display","none")
        var startx= e.offsetX;
        var starty= e.offsetY;
           that.copy.onmousemove=function(e){
               //每一次绘制图形都要清空画布
               that.cobj.clearRect(0,0,that.w,that.h);

               //每一次都要把之前保存的状态重新绘制一便，如果之前没有保存状态忽略
               if(that.arr.length!=0){
                   that.cobj.putImageData(that.arr[that.arr.length-1],0,0);
               }

               var endx= e.offsetX;
               var endy= e.offsetY;
               //判断是否有画图的方法，内有代码不执行
               if(that.type==""){
                   return false;
               }
               //根据type类型，选择画图的类型
               that[that.type](startx,starty,endx,endy);

           }

           that.copy.onmouseup=function(e){
               //当鼠标抬起的时候将最新的画布的状态给保存下来
               that.arr.push(that.cobj.getImageData(0,0,that.w,that.h));
               that.copy.onmousemove=null;
               that.copy.onmouseup=null;
           }


       }
   },

   line:function(x,y,x1,y1){

     var that=this;
     that.init();
     var cobj=that.cobj;
     cobj.beginPath();
     cobj.moveTo(x,y);
     cobj.lineTo(x1,y1);
     cobj.stroke();
     cobj.closePath();
   },
    circle:function(x,y,x1,y1){
        var that=this;
        that.init();
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y))
        var cobj=that.cobj;
        cobj.beginPath();
        cobj.arc(x,y,r,0,2*Math.PI);
        cobj[that.style]();
        cobj.closePath();
    },
    rect:function(x,y,x1,y1){
        var that=this;
        that.init();
        var cobj=that.cobj;
        cobj.beginPath();
        cobj.rect(x,y,x1-x,y1-y);
        cobj[that.style]();
        cobj.closePath();
    },

    pen:function(){
      var that=this;
      var copy=that.copy;
      copy.onmousedown=function(e){
          var startx= e.offsetX;
          var starty= e.offsetY;
          that.init();
          that.cobj.beginPath();
          that.cobj.moveTo(startx,starty);
          copy.onmousemove=function(e){
              var endx= e.offsetX;
              var endy= e.offsetY;
              that.cobj.lineTo(endx,endy);
              that.cobj.stroke();
          }

          copy.onmouseup=function(){
              that.cobj.closePath();
              that.arr.push(that.cobj.getImageData(0,0,that.w,that.h));
              copy.onmouseup=null;
              copy.onmousemove=null;
          }

      }
    },
    //创建橡皮
    createxp:function(){
        var that=this;
       return $("<div>").css({
            position:"absolute",
            left:0,top:0,border:"1px solid #000",width:that.size,height:that.size,
           display:"none"
        }).appendTo(that.box);
    },
    //擦除的方法
    clear:function(){
        var that=this;
        var copy=that.copy;
      copy.onmouseout=function(){
          that.xiangpi.css("display","none")
      }
      copy.onmousemove=function(e){
          var startx= e.offsetX;
          var starty= e.offsetY;
          var left=startx-that.size/2;
          var top=starty-that.size/2;
          if(left<0){
              left=0;
          }
          if(left>that.w-that.size){
              left=that.w-that.size
          }
          if(top<0){
              top=0;
          }
          if(top>that.h-that.size){
              top=that.h-that.size
          }
          that.xiangpi.css({
              width:that.size,height:that.size,left:left,top:top,display:"block"
          })
      }

        copy.onmousedown=function(){
            copy.onmousemove=function(e){
                var startx= e.offsetX;
                var starty= e.offsetY;
                var left=startx-that.size/2;
                var top=starty-that.size/2;
                if(left<0){
                    left=0;
                }
                if(left>that.w-that.size){
                    left=that.w-that.size
                }
                if(top<0){
                    top=0;
                }
                if(top>that.h-that.size){
                    top=that.h-that.size
                }
                that.xiangpi.css({
                    width:that.size,height:that.size,left:left,top:top,display:"block"
                })
                that.cobj.clearRect(left,top,that.size,that.size)
            }
            copy.onmouseup=function(){
                copy.onmousemove=null;
                copy.onmouseup=null;
                that.arr.push(that.cobj.getImageData(0,0,that.w,that.h));
            }
        }
    },
    createS:function(){
        var that=this;
        return $("<div>").css({
            position:"absolute",
            left:0,top:0,border:"1px dashed #000",width:that.sw,height:that.sh,
            display:"none"
        }).appendTo(that.box);
    },
    select:function(){
       var that=this;
       that.copy.onmousedown=function(e){
           var startx= e.offsetX;
           var starty= e.offsetY;
           that.copy.onmousemove=function(e){
               var endx= e.offsetX;
               var endy= e.offsetY;
               that.s.css({
                   display:"block",
                   left:startx,
                   top:starty,
                   width:endx-startx,
                   height:endy-starty,
               })

               that.sx=startx;
               that.sy=starty;
               that.sw=endx-startx;
               that.sh=endy-starty;

           }

           that.copy.onmouseup=function(){
               that.copy.onmousemove=null;
               that.copy.onmouseup=null;
               that.move();
           }

       }

    },
    move:function(){
        var that=this;
        var flag=true;
        that.copy.onmousemove=function(e){
           var startx= e.offsetX;
           var starty= e.offsetY;
           if(startx>that.sx&&startx<that.sx+that.sw&&starty>that.sy&&starty<that.sy+that.sh){
               that.copy.style.cursor="move";
               flag=true;
           }else{
               that.copy.style.cursor="default";
               flag=false;
           }
        }

        that.copy.onmousedown=function(e){
            if(!flag){
                return;
            }

            that.sdata=that.cobj.getImageData(that.sx,that.sy,that.sw,that.sh);
            that.cobj.clearRect(that.sx,that.sy,that.sw,that.sh)

            that.arr.push(that.cobj.getImageData(0,0,that.w,that.h));

            that.cobj.putImageData(that.sdata,that.sx,that.sy)




            var startx= e.offsetX;
            var starty= e.offsetY;
            var endx,endy,chax,chay,left,top;
            that.copy.onmousemove=function(e){
                 endx= e.offsetX;
                 endy= e.offsetY;
                 chax=startx-that.sx;
                 chay=starty-that.sy;
                  left=endx-chax;
                  top=endy-chay;
                 if(left<0){
                     left=0;
                 }
                 if(left>that.w-that.sw){
                     left=that.w-that.sw
                 }
                if(top<0){
                    top=0;
                }
                if(top>that.h-that.sh){
                    top=that.h-that.sh
                }
                that.s.css({
                    left:left,
                    top:top
                })

                   that.cobj.clearRect(0,0,that.w,that.h);

                that.cobj.putImageData(that.arr[that.arr.length-1],0,0);
                that.cobj.putImageData(that.sdata,left,top)

            }

            that.copy.onmouseup=function(){
                that.sx=left;
                that.sy=top;

                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                that.move();
                that.arr.push(that.cobj.getImageData(0,0,that.w,that.h));

            }
        }
    }

}

