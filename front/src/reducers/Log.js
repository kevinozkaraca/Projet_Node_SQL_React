export default function logReducer(state = 0, action) {
  switch (action.type) {
    case "ZINDEX":
      return (state = 2);
    case "DECREMENT":
      return (state = 0);
    default:
      return state;
  }
}
