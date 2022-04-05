let r = 254, g = 0, b = 0, d = 0;
setInterval(() => {
    switch (d) {
        case 0:
            r ++;
            if (r === 255) {
                d ++;
            }
            break;
        case 1:
            g ++;
            if (g === 255) {
                d ++;
            }
            break;
        case 2:
            r --;
            if (r === 0) {
                d ++;
            }
            break;
        case 3:
            b ++;
            if (b === 255) {
                d ++;
            }
            break;
        case 4:
            g --;
            if (g === 0) {
                d ++;
            }
            break;
        case 5:
            r ++;
            if (r === 255) {
                d ++;
            }
            break;
        case 6:
            b --;
            if (b === 0) {
                d = 1;
            }
            break;
    }
    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}, 1000 / 60);
