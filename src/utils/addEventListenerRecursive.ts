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
  let unsubscribes: any[] = [];

  const addListener = () => {
    nodes.forEach((node: any) => {
      unsubscribes.push(
        registerEventListenerRecursive(node, type, listener, options)
      );
    });
  };

  const removeListener = () => {
    unsubscribes.forEach((unsubscribe) => unsubscribe());
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
  childNode: any,
  type: string,
  listener: (event: Event | MouseEvent) => void,
  options?: any
) => {
  Array.from(childNode.children as HTMLCollection).forEach((node: any) => {
    if (node.children.length > 0) {
      (node as ChildNode).addEventListener(type, listener, options);
      registerEventListenerRecursive(node, type, listener, options);
    }
    if (node.children.length === 0) {
      const key =
        Object.keys(node).find((key) => key.match(/^__reactProps\$.+$/)) ?? "";
      const listenerWithEventHandler = (e: any) => {
        listener(e);
        node?.[key]?.onClick();
      };
      (node as ChildNode).addEventListener(
        type,
        listenerWithEventHandler,
        options
      );
    }
  });
  return () => {
    Array.from(childNode.children as HTMLCollection).forEach((node: any) => {
      if (node.children.length > 0) {
        (node as ChildNode).removeEventListener(type, listener, options);
        registerEventListenerRecursive(node, type, listener, options);
      }
      if (node.children.length === 0) {
        const key =
          Object.keys(node).find((key) => key.match(/^__reactProps\$.+$/)) ??
          "";
        const listenerWithEventHandler = (e: any) => {
          listener(e);
          node?.[key]?.onClick();
        };
        (node as ChildNode).removeEventListener(
          type,
          listenerWithEventHandler,
          options
        );
      }
    });
  };
};
