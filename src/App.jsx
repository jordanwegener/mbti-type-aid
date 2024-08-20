import "./App.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

function App() {
  return (
    <MantineProvider>
      <div>
        <p>Welcome to the app</p>
      </div>
    </MantineProvider>
  );
}

export default App;
