import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Home } from "./pages/Home";
import { Payment } from "./pages/Payment";
import { ProtectedRoute } from "./auth/protected-route";
import "./App.css";


function App() {
  return (
    // Router Code
    <BrowserRouter>
      <div className="App">
        <Route path="/" exact strict component={Home} />
        <Route path="/payment" exact strict component={Payment} />
        {/* <Route 
            path='/anotherpage'
            exact 
            strict
            component = {AnotherPage}
          /> */}
      </div>
    </BrowserRouter>
  );
}
export default App;
