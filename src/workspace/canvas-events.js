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

export function delegateEvents(canvas, workspace) {
  for (let eventName in EVENT_LIST) {
    canvas.addEventListener(eventName, invokeToolProc.bind(null, eventName, workspace));
  }
}

function invokeToolProc(eventName, workspace, ...args) {
  let tool = workspace.activeTool;

  if (tool && tool[eventName]) {
    tool[eventName].call(tool, ...args);
  }
}
