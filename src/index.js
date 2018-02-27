// import is from '@meitu/is';
export default function matting(options){
    if(!options.image){
        console.error('there must be a image contains mask and result.');
        return;
    }
    let image = options.image;
    let ops = extend({
        export_quality: .9,
        export_type : 'base64',   // canvas dom or base64;
        mask_zoom : 0.5 ,   // 0 < mask_zoom <= 1
        success(){},
        error(){},
    }, options);

    let origin, originCtx, mask, maskCtx, result, resultCtx;

    loadImage(image, imgEl => {
        // 绘制原图；
        origin = document.createElement('canvas');
        originCtx = origin.getContext('2d');
        origin.width = imgEl.naturalWidth;
        origin.height = imgEl.naturalHeight / 2;
        originCtx.drawImage(imgEl, 0, 0);

        // 绘制mask；
        mask = document.createElement('canvas');
        maskCtx = mask.getContext('2d');
        mask.width = imgEl.naturalWidth * ops.mask_zoom;
        mask.height = imgEl.naturalHeight * ops.mask_zoom / 2;
        maskCtx.drawImage(imgEl, 0, - imgEl.naturalHeight * ops.mask_zoom / 2, imgEl.naturalWidth * ops.mask_zoom , imgEl.naturalHeight * ops.mask_zoom);

        // 去除mask图黑色背景；
        let maskData = maskCtx.getImageData(0, 0, mask.width, mask.height);
        filter(maskData.data);
        maskCtx.putImageData(maskData, 0, 0);

        result = document.createElement('canvas');
        resultCtx = result.getContext('2d');
        result.width = imgEl.naturalWidth;
        result.height = imgEl.naturalHeight / 2;

        resultCtx.drawImage(mask, 0, 0, imgEl.naturalWidth, imgEl.naturalHeight / 2);

        resultCtx.globalCompositeOperation = 'source-in';

        resultCtx.drawImage(origin, 0, 0);

        if(ops.export_type == 'canvas'){
            ops.success(result);
        }else{
            ops.success(result.toDataURL(`image/png`, ops.quality));
        }
    }, err => {
        ops.error(err);
    });
}

function loadImage(image, cbk, error){
    if(typeof image == 'string'){
        let img = new Image();
        img.crossOrigin = '*';
        img.onload = () => {
            cbk(img);
        };
        img.onerror = () => {
            console.error('load image error!');
            error(image);
        };
        img.src = image + `?${new Date().getTime()}`;
    }else{
        cbk(image);
    }
}
function filter(data) {
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i],
            g = data[i + 1],
            b = data[i + 2];

        if (r <= 30 && g <= 30 && b<= 30) {
            data[i + 3] = 0;
        }
    }
}
function extend(obj1, obj2) {
    for (let k in obj2) {
        if (obj2.hasOwnProperty(k)) {
            if (typeof obj2[k] == 'object') {
                if (typeof obj1[k] !== 'object' || obj1[k] === null) {
                    obj1[k] = {};
                }
                extend(obj1[k], obj2[k]);
            } else {
                obj1[k] = obj2[k];
            }
        }
    }
    return obj1;
}
