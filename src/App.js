function App() {
  const makeReq = query => {
    console.log("make request with query:", query);
  }

  const handleQueryChange = e => {
    const { value } = e.target;
    makeReq(value);
  }

  return (
    <div>
      <input onChange={handleQueryChange} />

    </div>
  );
}

export default App;
