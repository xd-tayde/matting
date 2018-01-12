import matting from '../src/index';

window.onload = function(){
    let $btn = document.getElementById('btn');
    let $origin = document.getElementById('origin');
    let $result = document.getElementById('result');
    $btn.addEventListener('click',function(){
        matting({
            image: $origin,
            export_quality: .9,
            export_type : 'base64',   // canvas dom or base64;
            mask_zoom : 0.5 ,
            success(result){
                // canvas.className = 'image';
                let img = document.createElement('img');
                img.className = 'image';
                img.src = result;

                $result.appendChild(img);
            },
        });
    });
};
