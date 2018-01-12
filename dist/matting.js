(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Matting = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// import is from '@meitu/is';
function matting(options) {
    if (!options.image) {
        console.error('there must be a image contains mask and result.');
        return;
    }
    var image = options.image;
    var ops = extend({
        export_quality: .9,
        export_type: 'base64', // canvas dom or base64;
        mask_zoom: 0.5, // 0 < mask_zoom <= 1
        success: function success() {}
    }, options);

    var origin = void 0,
        originCtx = void 0,
        mask = void 0,
        maskCtx = void 0,
        result = void 0,
        resultCtx = void 0;

    loadImage(image, function (imgEl) {
        console.dir(image);
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
        maskCtx.drawImage(imgEl, 0, -imgEl.naturalHeight * ops.mask_zoom / 2, imgEl.naturalWidth * ops.mask_zoom, imgEl.naturalHeight * ops.mask_zoom);

        // 去除mask图黑色背景；
        var maskData = maskCtx.getImageData(0, 0, mask.width, mask.height);
        filter(maskData.data);
        maskCtx.putImageData(maskData, 0, 0);

        result = document.createElement('canvas');
        resultCtx = result.getContext('2d');
        result.width = imgEl.naturalWidth;
        result.height = imgEl.naturalHeight / 2;

        resultCtx.drawImage(mask, 0, 0, imgEl.naturalWidth, imgEl.naturalHeight / 2);

        resultCtx.globalCompositeOperation = 'source-in';

        resultCtx.drawImage(origin, 0, 0);

        if (ops.export_type == 'canvas') {
            ops.success(result);
        } else {
            ops.success(result.toDataURL('image/png', ops.quality));
        }
    });
}

function loadImage(image, cbk) {
    if (typeof image == 'string') {
        var img = new Image();
        img.crossOrigin = '*';
        img.onload = function () {
            cbk(img);
        };
        img.onerror = function () {
            console.error('load image error!');
        };
        img.src = image + ('?' + new Date().getTime());
    } else {
        cbk(image);
    }
}
function filter(data) {
    for (var i = 0; i < data.length; i += 4) {
        var r = data[i],
            g = data[i + 1],
            b = data[i + 2];

        if (r <= 30 && g <= 30 && b <= 30) {
            data[i + 3] = 0;
        }
    }
}
function extend(obj1, obj2) {
    for (var k in obj2) {
        if (obj2.hasOwnProperty(k)) {
            if (_typeof(obj2[k]) == 'object') {
                if (_typeof(obj1[k]) !== 'object' || obj1[k] === null) {
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

return matting;

})));
//# sourceMappingURL=matting.js.map
