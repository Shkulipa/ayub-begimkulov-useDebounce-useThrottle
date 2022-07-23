import { useState, useMemo, useEffect } from "react";
import { debounce } from "lodash-es";
import useLatest from "./hooks/useLatest";

function useDebounce(cb, ms) {
  /**
   * @info
   * 1. для сохранения ссылки на предыдущую функцию
   */
  const latestCb = useLatest(cb); 

  const debouncedFn = useMemo(
    () => 
      debounce((fn) => {
        /**
         * @info
         * 2. меняется current свойство внутри 
         * и по этому useMemo вызывается только один раз
         * 
         * если бы вместо (fn) => {...} использовалось cb с аргументов, это фенкиця каждый раз создавалась новая
         */
        latestCb.current(fn);
      }, ms), 
    [ms, latestCb]
  )

  useEffect(() => () => debouncedFn.cancel(), [debouncedFn]);

  return debouncedFn;
}

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
