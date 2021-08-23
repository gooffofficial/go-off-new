// Module Imports
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query'
import store from './redux';

// Component Imports
import App from './App';

export const queryClient = new QueryClient()

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
	  <Provider store={store}>
	  	<Router>
	  		<React.StrictMode>
	  			<App />
	  		</React.StrictMode>
	  	</Router>
	  </Provider>
  </QueryClientProvider>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
