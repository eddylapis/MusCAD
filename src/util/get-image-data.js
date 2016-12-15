export default function getImageData(src, onDone) {
  let img = new Image();
  img.onload = function() {
    let data = _extractData(img);
    onDone.call(null, data);
  };
  img.src = src;
}

function _extractData(img) {
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
  canvas.width = nextHighestPowerOfTwo(img.width);
  canvas.height = nextHighestPowerOfTwo(img.height);
  context.drawImage(img,
    0, 0, img.width, img.height,
    0, 0, canvas.width, canvas.height);

  let imgData = context.getImageData(0, 0, canvas.width, canvas.height);
  context = null;
  canvas = null;

  return imgData;

  function isPowerOfTwo(x) {
    return (x & (x - 1)) === 0;
  }

  function nextHighestPowerOfTwo(x) {
    --x;
    for (var i = 1; i < 32; i <<= 1) {
      x = x | x >> i;
    }
    return x + 1;
  }
}
