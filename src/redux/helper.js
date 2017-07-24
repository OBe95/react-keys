import { EXIT_STRATEGY_MEMORY } from '../constants';

export const findMountedId = binders => {
  const firstMounted = findMounted(binders);
  return firstMounted ? firstMounted.id : undefined;
};

export const findMounted = binders => binders.find(binder => binder.mounted);

export const findBinder = (binders, binderId) =>
  binders.find(binder => binder.id === binderId);

export const updateBinder = (binders, binder) => {
  const index = binders.findIndex(s => s.id === binder.id);
  return Object.assign([], binders, {
    [index]: { ...binders[index], ...binder },
  });
};

export const computeAddingBinder = (binders, binder) => {
  const freshBinders = addBinder(binders, binder);
  return computeMountBinder(freshBinders, binder);
};

export const addBinder = (binders, binder) => [...binders, binder];

export const computeMountBinder = (binders, binder) =>
  isBinderShouldMount(binders, binder)
    ? mountBinder(binders, binder.id)
    : binders;

export const isBinderShouldMount = (binders, binder) => {
  const mountedBinder = findMounted(binders);
  return !mountedBinder || binder.priority >= mountedBinder.priority;
};

export const mountBinder = (binders, binderId) =>
  binders.map(binder => {
    const formatedBinder = {
      ...binder,
      mounted: binder.id !== binderId ? false : true,
    };
    if (binder.id === binderId) {
      formatedBinder.mountedTime = Date.now();
    }
    return formatedBinder;
  });

export const computeRemoveBinder = (binders, binderId) => {
  const freshBinders = removeBinder(binders, binderId);
  return !hasMountedBinder(freshBinders)
    ? mountfreshestBinder(freshBinders)
    : freshBinders;
};

export const removeBinder = (binders, binderId) => {
  const binder = binders.find(binder => binder.id === binderId);
  if (binder.enterStrategy === EXIT_STRATEGY_MEMORY) {
    return binders.map(binder => ({
      ...binder,
      mounted: binder.id === binderId ? false : binder.mounted,
    }));
  }
  return binders.filter(binder => binder.id !== binderId);
};

export const hasMountedBinder = binders =>
  binders.some(binder => binder.mounted);

export const mountfreshestBinder = binders => {
  const freshestBinder = binders.reduce(
    (prev, current) =>
      prev.mountedTime > current.mountedTime ? prev : current,
    binders[0]
  );
  freshestBinder.mounted = true;
  return mountBinder(binders, freshestBinder.id);
};

export const buildCurrent = binders => {
  const mountedbinder = findMounted(binders);
  return {
    binderId: mountedbinder.id,
    selectedId: mountedbinder.selectedId,
  };
};

export const buildBinderFromProps = (props, type) => ({
  id: props.id,
  active: props.active,
  type,
  selector: props.selector,
  gap: props.gap,
  boundedGap: props.boundedGap,
  topGap: props.topGap,
  rightGap: props.rightGap,
  leftGap: props.leftGap,
  downGap: props.downGap,
  enterStrategy: props.enterStrategy,
  position: props.position,
  priority: props.priority,
  elements: [],
  hasMoved: false,
  marginLeft: 0,
  marginTop: 0,
});

export const buildCarsouelFromProps = (props, type) => ({
  id: props.id,
  type,
  active: props.active,
  circular: props.circular,
  size: props.size,
  index: props.index,
  priority: props.priority,
  elements: [],
});
