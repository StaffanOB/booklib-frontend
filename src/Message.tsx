
function Message() {
  const name = "Staffan";
  if (!name) {
    return <h1>Hello, Stranger.</h1>;
  }
  return <h1>Hi {name}</h1>;
}

export default Message;