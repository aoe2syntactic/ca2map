const canvas = document.querySelector("#output");
    const preview = document.querySelector("#preview");

    const fileInput = document.querySelector("#screenshot");
    const centeredInput = document.querySelector("#centered");
    const squaredInput = document.querySelector("#squared");

    function drawClipMap(ctx, width, height) {
        ctx.beginPath();

        const offset = 0
        let left, right, top, bottom;

        if (height % 2) {
            left = [[1, Math.floor(height / 2)]]
            right = [[width - 2, Math.floor(height / 2)]]
        } else {
            left = [
                [offset, height / 2],
                [offset, height / 2 - 1]
            ]
            right = [
                [width - 4, height / 2 - 1],
                [width - 4, height / 2]
            ]
        }

        if (width % 2) {
            top = [[Math.floor(width / 2), offset]]
            bottom = [[Math.floor(width / 2), height - 1 - offset]]
        } else {
            top = [
                [width / 2 - 2, offset],
                [width / 2 - 2, offset]
            ]
            bottom = [
                [width / 2, height - 1],
                [width / 2 - 1, height - 1]
            ]
        }

        [...left].forEach(element => {
            ctx.moveTo(...element)
        });

        [...top, ...right, ...bottom, ...left].forEach(element => {
            ctx.lineTo(...element)
        });
        ctx.clip();
    }

    function drawImage(ctx, img) {
        const center = centeredInput.checked
        const squared = squaredInput.checked

        var height = 0.215*img.height
        var width = Math.floor(2*height)
        height = Math.floor(height)

        var left
        if (center) {
            left = Math.floor(img.width/2 - width/2)
        } else {
            left = img.width - width
        } 

        left += 2

        canvas.height = height - 1;
        canvas.width = squared ? height - 3 : width - 4;

        drawClipMap(ctx, squared ? height : width, height);

        ctx.drawImage(img,
            left, // source x
            img.height - height, // source y 
            width, // source width
            height, // source heigth
            0, 0, // target x, y
            squared ? height : width, // target width
            height // target height
        );
    } 

    
    function processFile() {
        const reader = new FileReader();
        const img = new Image();

        const ctx = canvas.getContext("2d");
        ctx.globalAlpha = 0.0;
        
        img.addEventListener("load",
            () => drawImage(ctx, img)
        );
        reader.addEventListener(
            "load",
            () => {
                // convert image file to base64 string
                preview.src = reader.result;
                img.src = reader.result;
            },
            false,
        );

        const file = fileInput.files[0]
        if (file) {
            reader.readAsDataURL(file);
        }
    }

    function exportImage() {
        const file = fileInput.files[0]
        const imgUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgUrl;
        link.download = file.name.substr(0, file.name.lastIndexOf('.')) + '_minimap.png' 
        link.click();
    }

    const exportButton = document.querySelector("#export");
    exportButton.addEventListener("click", exportImage);
    fileInput.addEventListener("change", processFile);
    centeredInput.addEventListener("click", processFile);
    squaredInput.addEventListener("click", processFile);

    processFile();