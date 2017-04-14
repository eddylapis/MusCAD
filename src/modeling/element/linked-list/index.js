import { _genMapCond, _genMap, _genStop } from '../generator-util';

function connect(left, mid, right) {
  left._next = mid;
  mid._prev = left;
  mid._next = right;
  right._prev = mid;
}

function init(list, first) {
  list.head = first;
  first._next = first;
  first._prev = first;
}

/* Element instance needs to have:
 * getter & setter: this._prev, this._next
 * setter: this._setParent
 */

export class CyclicDblLinkedListContainer {
  constructor(parentPointer) {
    this.head = null;
    this._parentPointer = parentPointer;
  }

  get last() { return this.head._prev; }
  get isEmpty() { return !this.head; }

  setElementParent(el) { el._setParent(this._parentPointer); }

  append(el) {
    (this.isEmpty) ? init(this, el) : connect(this.last, el, this.head);

    this.setElementParent(el);

    return el;
  }

  insertAfter(ref, el) {
    this._checkInclude(ref);

    connect(ref, el, ref._next);

    this.setElementParent(el);

    return el;
  }

  insertBefore(ref, el) {
    this._checkInclude(ref);

    connect(ref._prev, el, ref);

    this.setElementParent(el);

    return el;
  }

  _checkInclude(el) {
    let gen = this._genStop(), res = {}, flag = false;
    while (!res.done) res = gen.next(flag = el === res.value);

    if (!flag) throw(`${el.name} not in ${this._parentPointer.name}`);
  }

  remove(el) {
    this._checkInclude(el);

    let left = el._prev;
    let right = el._next;
    left._next = right;
    right._prev = left;
    el._prev = null;
    el._next = null;

    if (this.head === el) this.head = null;

    return el;
  }

  //Iterator
  *[Symbol.iterator]() { yield* this._gen(); }

  *_genMapCond(...args) { yield* _genMapCond(this._gen.bind(this), ...args); }
  *_genMap(...args) { yield* _genMap(this._gen.bind(this), ...args); }
  *_genStop(...args) { yield* _genStop(this._gen.bind(this), ...args); }

  *_gen() {
    if (this.isEmpty) return { done: true };

    let current = this.head;
    do {
      yield current;
      current = current._next;
    } while (current !== this.head);
  }
}

/* Element instance needs to have:
 * getter & setter: this._radial
 * setter: this._setRadialParent
 */
export class RadialCyclicLinkedListContainer {
  constructor(parentPointer) {
    this.head = null;
    this._parentPointer = parentPointer;
  }

  get isEmpty() { return !this.head; }

  setElementParent(el) { el._setRadialParent(this._parentPointer); }

  append(el) {
    if (this.isEmpty) {
      this.head = el;
      el._radial = el;
    } else {
      this.head._radial = el;
      el._radial = this.head;
    }

    this.setElementParent(el);

    return el;
  }

  //Iterator
  *[Symbol.iterator]() {
    if (this.isEmpty) return { done: true };

    let current = this.head;
    do {
      yield current;
      current = current._radial;
    } while (current !== this.head);
  }
}
