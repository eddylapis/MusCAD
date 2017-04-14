export function* _genMapCond(baseGen, f, condition) {
  let gen = baseGen(), res;
  while (true) {
    res = gen.next();
    if (res.done) return { done: true };
    let mapped = f(res.value);
    if (condition(mapped)) yield mapped;
  }
}

export function* _genMap(baseGen, f) {
  let gen = baseGen(), res;
  while (true) {
    res = gen.next();
    if (res.done) return { done: true };
    yield f(res.value);
  }
}

export function* _genStop(baseGen) {
  let gen = baseGen(), res, terminate = false;
  while (true) {
    res = gen.next();
    if (terminate || res.done) return { done: true };
    terminate = yield res.value;
  }
}
