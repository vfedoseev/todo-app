let uuid = function() {
  return Math.floor(Math.random() * 1E6);
}

let createSorter = function(propName, reverse = false) {
  return function(a, b) {
    let ap = a[propName];
    let bp = b[propName];
    let result;

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
