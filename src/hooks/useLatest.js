import { useRef, useLayoutEffect } from 'react';

function useLatest(value) {
  const valueRef = useRef(value);

  useLayoutEffect(() => {
    valueRef.current = value;
  }, [value])

  return valueRef;
}

export default useLatest;