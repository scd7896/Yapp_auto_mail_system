import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "../pages/Index";

const CheckList = () => {
    return (
        <div>
            hello world
            <App />
        </div>
    );
};
ReactDOM.render(<CheckList />, document.querySelector("#root"));
