import React from "react";
import App from "./App";
import Update from "./Update";
import Create from "./Create";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function Main() {
    return (
        <Router>
            <main>
                <Routes>
                    <Route path="/" exact element={<App />} />
                    <Route path="/updateMeeting" exact element={<Update />} />
                    <Route path="/newMeeting" exact element={<Create />} />
                </Routes>
            </main>
        </Router>
    );
}
export default Main;
