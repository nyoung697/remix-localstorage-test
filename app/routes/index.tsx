import * as React from "react";

export default function Index() {
  const [state, setState] = useLocalStorageState("test", "");

  return (
    <div>
      <h1>Hello</h1>
      <input value={state} onChange={(e) => setState(e.target.value)}></input>

      <div style={state ? { color: "red" } : {}}>
        {<p>The input state is: {state}</p>}
      </div>
    </div>
  );
}

/**
 * Code borrowed from
 * https://github.com/kentcdodds/react-hooks/blob/main/src/final/02.extra-4.js
 */
function useLocalStorageState(
  key: string,
  defaultValue: any = "",
  // the = {} fixes the error we would get from destructuring when no argument was passed
  // Check https://jacobparis.com/blog/destructure-arguments for a detailed explanation
  { serialize = JSON.stringify, deserialize = JSON.parse } = {}
) {
  const [state, setState] = React.useState(() => {
    if (typeof document !== "undefined") {
      const valueInLocalStorage = window.localStorage.getItem(key);
      if (valueInLocalStorage) {
        // the try/catch is here in case the localStorage value was set before
        // we had the serialization in place
        try {
          return deserialize(valueInLocalStorage);
        } catch (error) {
          window.localStorage.removeItem(key);
        }
      }
    }

    return typeof defaultValue === "function" ? defaultValue() : defaultValue;
  });

  const prevKeyRef = React.useRef(key);

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      const prevKey = prevKeyRef.current;
      if (prevKey !== key) {
        window.localStorage.removeItem(prevKey);
      }
      prevKeyRef.current = key;
      window.localStorage.setItem(key, serialize(state));
    }
  }, [key, state, serialize]);

  return [state, setState];
}

export { useLocalStorageState };
