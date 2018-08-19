let uuid = function() {
  return Math.floor(Math.random() * 1E6);
}

let createSorter = function(propName, reverse = false, propHandler) {
  return function(a, b) {
    let ap = a[propName];
    let bp = b[propName];
    let result;

    if (propHandler) {
      ap = propHandler(ap);
      bp = propHandler(bp);
    }

    if (ap < bp) {
      result = -1;
    } else if (ap > bp) {
      result = 1;
    } else {
      result = 0;
    }

    return reverse ? -result : result;
  }
}
