/**
 * collection of program-context
 */

import ProgramContext from './program-context';

let _lastContextID = 0;

class ProgramContexts {
  constructor() {
    this._contexts = {};
  }

  get contexts() { return this._contexts; }

  initialize(gl, glProgram, cb) {
    glProgram._contextID = ++_lastContextID;

    let pc = new ProgramContext(gl, glProgram);
    this.contexts[glProgram._contextID] = pc;

    if (cb) cb.call(pc, pc);
  }

  with(glProgram, cb) {
    let pc = this.contexts[glProgram._contextID];

    if (cb) cb.call(pc, pc);
  }
}

const instance = new ProgramContexts();

module.exports = instance;
