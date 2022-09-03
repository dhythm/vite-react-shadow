export const addEventListenerToWindowRecursive = (
  type: string,
  listener: any,
  options?: any
): (() => void) => {
  const addListener = () => {
    Array.from(document.querySelectorAll("*")).forEach((el) => {
      el.addEventListener(type, listener, options);
    });
  };
  const removeListener = () => {
    Array.from(document.querySelectorAll("*")).forEach((el) => {
      el.removeEventListener(type, listener, options);
    });
  };

  addListener();
  const timer = setInterval(() => {
    addListener();
  }, 1000);
  return () => {
    clearInterval(timer);
    removeListener();
  };
};

export const addEventListenerToAllNodes = (
  nodes: NodeListOf<ChildNode>,
  type: string,
  listener: (event: Event | MouseEvent) => void,
  options?: any
): (() => void) => {
  const addListener = () => {
    nodes.forEach((node: any) => {
      registerEventListenerRecursive("add", node, type, listener, options);
    });
  };

  const removeListener = () => {
    nodes.forEach((node: any) => {
      registerEventListenerRecursive("remove", node, type, listener, options);
    });
  };

  addListener();
  const timer = setInterval(() => {
    addListener();
  }, 1000);
  return () => {
    clearInterval(timer);
    removeListener();
  };
};

const registerEventListenerRecursive = (
  kind: "add" | "remove",
  childNode: any,
  type: string,
  listener: (event: Event | MouseEvent) => void,
  options?: any
) => {
  Array.from(childNode.children as HTMLCollection).forEach((node: any) => {
    if (node.children.length > 0) {
      if (kind === "add") {
        (node as ChildNode).addEventListener(type, listener, options);
      } else {
        (node as ChildNode).removeEventListener(type, listener, options);
      }
      registerEventListenerRecursive(kind, node, type, listener, options);
    }
    if (node.children.length === 0) {
      if (kind === "add") {
        (node as ChildNode).addEventListener(type, listener, options);
      } else {
        (node as ChildNode).removeEventListener(type, listener, options);
      }
    }
  });
};
