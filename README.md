# 抠人像插件--matting.js

### [demo](http://f2er.meitu.com/gxd/matting/example/index.html)

现在公司中的妆容处理可以输出对应的人像识别`mask`图层，通过`mask`，可以使用该简易插件进行人像的抠出，便于在业务中自由替换背景，完成特定的效果；

使用方式：

```js
matting({
    image: '',  //包含结果图和mask图的服务端返回图；
    export_type : 'base64',   // canvas / base64, 选择返回一个canvas节点或者返回base64；
    export_quality: .9,  // 当导出为base64时图片的质量；
    mask_zoom : 0.5 , // mask去除背景时的缩放比例，调节性能和质量的平衡
    success(result){
        // result 可能为 base64 或者 一个canvas节点；
    },
});
```
