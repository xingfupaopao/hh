$(function(){
    var box=$(".box");
    var canvasBox=$(".canvas");
    var canvas=$("canvas");
    var cobj=canvas[0].getContext("2d");
    var nav=$("nav");
    var copy=$(".copy").css("height",box.height()-nav.height());

    canvasBox.css("height",box.height()-nav.height());
    canvas.attr("width",box.width());
    canvas.attr("height",box.height()-nav.height());

    /*下拉菜单*/
    $(".menu:not(.no)").hover(function(){
        $(this).find(".son").finish();
         $(this).find(".son").slideToggle(100);
    })



    /*画布操作*/
     var obj=new draw(cobj,canvasBox,copy[0]);

    /*画图的类型*/
    $(".menu:eq(1)").find("li").click(function(){
        var role=$(this).attr("data-role");
        if(role=="pen"){
            obj.pen();
        }else{
            obj.type=role;
            obj.drawFun();
        }
    })

    /*画图的方式  【填充|划线】*/
    $(".menu:eq(2)").find("li").click(function(){
        obj.style=$(this).attr("data-role");
        obj.drawFun();
    })

    /*线条的粗细*/

    $(".menu:eq(3)").find("li").click(function(){
        obj.lineWidth=$(this).attr("data-role");
        obj.drawFun();
    })

    /*线条的颜色*/

    $(".menu:eq(4)").find("input").change(function(){
        obj.lineColor=$(this).val();
        obj.drawFun();
    })

    /*填充的颜色*/

    $(".menu:eq(5)").find("input").change(function(){
        obj.fillColor=$(this).val();
        obj.drawFun();
    })

    /*文件操作*/
    $(".menu:eq(0)").find("li").click(function(){
        obj.init();
        var index=$(".menu:eq(0) li").index(this);
        if(index==0){
          if(obj.arr.length>0){
             var yes= window.confirm("确定保存?")
             if(yes){
                 location.href=canvas[0].toDataURL().replace("image/png","image/octet-stream");
             }
          }
            obj.arr=[];
            cobj.clearRect(0,0,canvasBox.width(),canvasBox.height())

        }else if(index==1){
            cobj.clearRect(0,0,canvasBox.width(),canvasBox.height())
            if(obj.arr.length==0){
                alert("top");
                return false;
            }
            obj.arr.pop();
            cobj.putImageData(obj.arr[obj.arr.length-1],0,0);
        }else if(index==2){
          if(obj.arr.length==0){
              return false;
          }
          location.href=canvas[0].toDataURL().replace("image/png","image/octet-stream");
        }
    })

    /*擦除*/
    $(".menu:eq(6)").find("li").click(function(){
       obj.size=$(this).attr("data-role");
       obj.clear();
    })

    /*选择*/
    $(".menu:eq(7)").find(".options").click(function(){
        obj.select();
    })

})