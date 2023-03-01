const clickOutside = {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      // if the click event was triggered for an element outside the target element
      if (!(el === event.target || el.contains(event.target))) {
        // trigger the event handler with event as an argument
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);
  },
  unbind: function (el) {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  },
};

export default clickOutside;
