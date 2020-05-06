import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "../pages/Check";

const CheckList = () => {
  return (
    <div>
      <App />
    </div>
  );
};
ReactDOM.render(<CheckList />, document.querySelector("#root"));
