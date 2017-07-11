# everant 视频切换组件

## 传入参数

1. 资源列表resources 数组 image/video
2. 绑定的canvas  el dom节点 
3. 切换效果 mask image
4. 切换效果切片每一张的大小 masksize  对象 {width： int ，height： int  }  
5. onUpdate 切换时候的回调函数 function 传入参数  百分比？

## 暴露接口

1. render 通知进行切换 ，每一帧都进行调用。参数： 是否进行切换？

   如果传入true就开始切换mask的切片，不为true的话就维持mask的位置不变

