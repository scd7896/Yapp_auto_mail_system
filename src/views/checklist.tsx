import * as React from "react";
import * as ReactDOM from "react-dom";
import CheckListPage from "../pages/CheckList";

const CheckList = () => {
    return (
        <div>
            hello world
            <CheckListPage />
        </div>
    );
};
ReactDOM.render(<CheckList />, document.querySelector("#root"));
