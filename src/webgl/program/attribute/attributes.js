import gl from '../../gl';
import extIns from '../../ext-ins';
import {BaseAttribute, BaseArrayAttribute} from './base-attribute';

const BYTES_FLOAT32 = 4;

export class ArrayAttribute1F extends BaseArrayAttribute {
  attrPointer(stride=0, offset=0) {
    gl.vertexAttribPointer(
      this.location,
      1,
      gl.FLOAT,
      false,
      stride,
      offset
    );
  }
}

export class ArrayAttribute2F extends BaseArrayAttribute {
  attrPointer(stride=0, offset=0) {
    gl.vertexAttribPointer(
      this.location,
      2,
      gl.FLOAT,
      false,
      stride,
      offset
    );
  }
}

export class ArrayAttribute3F extends BaseArrayAttribute {
  attrPointer(stride=0, offset=0) {
    gl.vertexAttribPointer(
      this.location,
      3,
      gl.FLOAT,
      false,
      stride,
      offset
    );
  }
}

export class ArrayAttribute16F extends BaseArrayAttribute {
  attrPointer(stride=0, offset=0) {
    stride = stride + 64;
    gl.vertexAttribPointer(this.location+0, 4, gl.FLOAT, false, stride, offset + 0);
    gl.vertexAttribPointer(this.location+1, 4, gl.FLOAT, false, stride, offset + 16);
    gl.vertexAttribPointer(this.location+2, 4, gl.FLOAT, false, stride, offset + 32);
    gl.vertexAttribPointer(this.location+3, 4, gl.FLOAT, false, stride, offset + 48);
  }

  attrDivisor(divisor=1) {
    extIns.vertexAttribDivisorANGLE(this.location+0, divisor);
    extIns.vertexAttribDivisorANGLE(this.location+1, divisor);
    extIns.vertexAttribDivisorANGLE(this.location+2, divisor);
    extIns.vertexAttribDivisorANGLE(this.location+3, divisor);
  }
}

export class Attribute1F extends BaseAttribute {
  update(v) { gl.vertexAttrib1f(this.location, v); }
}

export class Attribute3F extends BaseAttribute {
  update(v) { gl.vertexAttrib3fv(this.location, v); }
}

export class Attribute4F extends BaseAttribute {
  update(v) { gl.vertexAttrib4fv(this.location, v); }
}

export class Attribute16F extends BaseAttribute {
  update(v) {
    throw('not implemented');
    //gl.vertexAttrib4f(this.location+0, v[0], v[1], v[2], v[3]);
    //gl.vertexAttrib4f(this.location+1, v[4], v[5], v[6], v[7]);
    //gl.vertexAttrib4f(this.location+2, v[8], v[9], v[10], v[11]);
    //gl.vertexAttrib4f(this.location+3, v[12], v[13], v[14], v[15]);

    //gl.vertexAttrib4f(this.location+0, v[0], v[4], v[8], v[12]);
    //gl.vertexAttrib4f(this.location+1, v[1], v[5], v[9], v[13]);
    //gl.vertexAttrib4f(this.location+2, v[2], v[6], v[10], v[14]);
    //gl.vertexAttrib4f(this.location+3, v[3], v[7], v[11], v[15]);
  }
}
