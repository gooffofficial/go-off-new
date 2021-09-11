// Module Imports
import React, { useState } from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import store from "./redux";
import { UserProvider } from "./contexts/userContext";
import { routeContext } from "./contexts/useReroute";

// Component Imports
import App from "./App";

const Index = () => {
  const [currentLocation, setCurrentLocation] = useState("");

  return (
    <QueryClientProvider client={queryClient}>
      <routeContext.Provider value={{ currentLocation, setCurrentLocation }}>
          <UserProvider>
            <Provider store={store}>
              <Router>
                <React.StrictMode>
                  <App />
                </React.StrictMode>
              </Router>
            </Provider>
          </UserProvider>
      </routeContext.Provider>
    </QueryClientProvider>
  );
};
export const queryClient = new QueryClient();

ReactDOM.render(<Index />, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
