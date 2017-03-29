const EVENT_LIST = {
  wheel: 'wheel',
  click: 'click',
  mousemove: 'mousemove',
  mousedown: 'mousedown',
  mouseup: 'mouseup',
  mouseout: 'mouseout',
  mouseover: 'mouseover',
  mouseenter: 'mouseenter',
  mouseleave: 'mouseleave',
};

const MAP_ARGS = {
  mousemove: function(args, canvas) {
    let e = args[0];
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    return [event, x, y];
  },
};

export function delegateEvents(canvas, workspace) {
  for (let eventName in EVENT_LIST) {
    canvas.addEventListener(eventName, invokeToolProc.bind(null, eventName, workspace, canvas));
  }
}

function invokeToolProc(eventName, workspace, canvas, ...args) {
  let tool = workspace.activeTool;
  if (!tool) return;

  let eventProc = tool[eventName];
  if (!eventProc) return;

  let transformArgs = MAP_ARGS[eventName];
  if (transformArgs) args = transformArgs(args, canvas);

  eventProc.call(tool, ...args);
}
