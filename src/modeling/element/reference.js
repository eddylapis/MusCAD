import {
  Application,
} from '../../initializer';

export default class Reference {
  constructor() {
    this.id = null;
    this.definitionID = null;
    this.absTrans = null;
    this.materialID = null;
  }

  get material() {
    return Application.materials[this.materialID];
  }
}
