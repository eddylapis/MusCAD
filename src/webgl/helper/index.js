let cashe = {};

export function stride(structure) {
  if (cashe[structure]) return cashe[structure];
  return cashe[structure] = _byteLen(_replace(structure));
}

export function offset(structure) { return stride(structure); }

function _byteLen(str) {
  return str
    .split('')
    .map(c => {
      if (c === 'f') return 4;
    }).reduce((acc, n) => acc + n, 0);
}

function _replace(str) {
  return str
    .replace(/x/g, 'f')
    .replace(/y/g, 'f')
    .replace(/z/g, 'f')
    .replace(/s/g, 'f')
    .replace(/t/g, 'f');
}
