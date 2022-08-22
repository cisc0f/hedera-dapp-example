import React from "react";
import {connect, run} from "./run.js";


function App() {
	return (
		<div className="App">
			<button onClick={connect}>Connect Wallet</button>
			
			<button onClick={run}>Execute Function</button>
		</div>
	);
}
export default App;
