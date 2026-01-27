import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_Nj7xV6STB",
      userPoolClientId: "11ohlraq9la3mbhjtk5kl4jv5a",
    }
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <App />
);
