import { useState, useMemo, useEffect } from "react";
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

function App() {
  const [query, setQuery] = useState();

  console.log('re-render');

  const makeReq = useDebounce(
    () => console.log("make request with query:", query),
    1000
  )
  
  const handleQueryChange = e => {
    const { value } = e.target;
    makeReq(value);
    setQuery(value);
  }

  return (
    <div>
      <input onChange={handleQueryChange} />
    </div>
  );
}

export default App;
