
/* N - size of hilbert curve,
 * N must be power of 2;
 *
 * hindex - number between 0..(N*N-1)
 *
 * returns [x, y]
 */
function hindex2xy(hindex, N) {
    var positions = [
    /* 0: */ [0, 0],
    /* 1: */ [0, 1],
    /* 2: */ [1, 1],
    /* 3: */ [1, 0]
    ];

    var tmp = positions[last2bits(hindex)];
    hindex = (hindex >>> 2);

    var x = tmp[0];
    var y = tmp[1];

    for (var n = 4; n <= N; n *= 2) {
        var n2 = n / 2;

        switch (last2bits(hindex)) {
        case 0: /* left-bottom */
            tmp = x; x = y; y = tmp;
            break;

        case 1: /* left-upper */
            x = x;
            y = y + n2;
            break;

        case 2: /* right-upper */
            x = x + n2;
            y = y + n2;
            break;

        case 3: /* right-bottom */
            tmp = y;
            y = (n2-1) - x;
            x = (n2-1) - tmp;
            x = x + n2;
            break;
        }

        hindex = (hindex >>> 2);
    }

    return [x, y];

    function last2bits(x) { return (x & 3); }
}

function hilbertDemo(canvas, size) {
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = 'red';
    ctx.fillStyle = 'red';
    ctx.lineWidth = 5;

    var N = 32;

    var prev = [0, 0],
        curr;

    var blockSize = Math.floor(size / N);
    var offset = blockSize/2;

    for (var i = 0; i < N*N; i += 1) {
        var color = 'hsl(' + Math.floor(i*360/(N*N)) + ', 100%, 50%)';
        ctx.strokeStyle = color;
        ctx.fillStyle = color;

        curr = hindex2xy(i, N);

        dot(curr);
        line(prev, curr);

        prev = curr;
    }

    function dot(point) {
        var r = 5;
        var x = point[0], y = point[1];

        ctx.beginPath();
        ctx.arc(x*blockSize+offset, y*blockSize+offset, r, 0, 2*Math.PI);
        ctx.fill();
    }

    function line(from, to) {
        var off = offset;

        ctx.beginPath();
        ctx.moveTo(from[0]*blockSize+off, from[1]*blockSize+off);
        ctx.lineTo(to[0]*blockSize+off, to[1]*blockSize+off);
        ctx.stroke();
    }
}
