import { useState, useMemo, useEffect, useRef } from "react";
import { debounce, throttle } from "lodash-es";
import useLatest from "./hooks/useLatest";

function makeDebounceHook(debounceFn) {
  return function useDebounce(cb, ms) {
    const latestCb = useLatest(cb); 

    const debouncedFn = useMemo(
      () => 
        debounceFn((fn) => {
          latestCb.current(fn);
        }, ms), 
      [ms, latestCb]
    )

    useEffect(() => () => debouncedFn.cancel(), [debouncedFn]);

    return debouncedFn;
  }
}

const useDebounce = makeDebounceHook(debounce);
const useThrottle = makeDebounceHook(throttle);

function makeDebounceEffectHook(useDebounceHook) {
  return function (cb, deps, ms) {
    const [isInitialRender, setIsInitialRender] = useState(true);
    const cleanUpFn = useRef();

    const debouncedCb = useDebounceHook(() => {
      cleanUpFn.current = cb();
    }, ms);

    useEffect(() => {
      if (isInitialRender) {
        setIsInitialRender(false);
        return;
      }

      debouncedCb();

      return () => {
        if (typeof cleanUpFn.current === "function") {
          cleanUpFn.current();
          cleanUpFn.current = undefined;
        }
      };
    }, [debouncedCb, ...deps]);
  };
}

const useDebounceEffect = makeDebounceEffectHook(useDebounce);
const useThrottleEffect = makeDebounceEffectHook(useThrottle);

function App() {
  const [query, setQuery] = useState("");

  console.log('re-render');

  useDebounceEffect(
    () => {
      console.log("make request with query: ", query);

      return () => {
        console.log("cancel request with query: ", query);
      };
    },
    [query],
    500
  );
  
  const handleQueryChange = e => {
    const { value } = e.target;
    setQuery(value);
  }

  return (
    <div>
      <input onChange={handleQueryChange} />
    </div>
  );
}

export default App;
