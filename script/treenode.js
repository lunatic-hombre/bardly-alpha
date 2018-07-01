class TreeNode {
  constructor(data, parent) {
    Object.assign(this, data || {});
    Object.defineProperty(this, '_parent', {
      value: parent
    });
    Object.defineProperty(this, '_children', {
      value: []
    });
  }
  push(data) {
    if (data instanceof TreeNode) {
      this._children.push(data);
    } else {
      this._children.push(new TreeNode(data, this));
    }
    return this;
  }
  firstChild() {
    return this._children && this._children[0];
  }
  parent() {
    return this._parent;
  }
  remove() {
    if (this._parent) {
      this._parent._children.splice(this._parent._children.indexOf(this), 1);
    }
    return this._parent;
  }
  // TODO remove
  map(mappingFunction) {
    return [...this].map(mappingFunction);
  }
  generations() {
    var obj = {}, gen = [this];
    obj[Symbol.iterator] = function() {
      return {
        next: () => {
          let current = gen;
          gen = gen.map(n => n._children).reduce((acc, val) => acc.concat(val), []); // flattened children
          return {
            done: gen.length === 0,
            value: current
          };
        }
      };
    };
    return obj;
  }
  append(data) {
    let n = null;
    for (n of this)
      ;
    n.push(data);
    return this;
  }
}
TreeNode.prototype[Symbol.iterator] = function() {
  let current = null, next = this;
  return {
    next: () => {
      current = next;
      next = current && current.firstChild();
      return {
        done: !current,
        value: current
      };
    }
  };
};