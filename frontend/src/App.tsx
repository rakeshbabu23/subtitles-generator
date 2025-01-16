import { Route, Routes } from "react-router-dom";
import Container from "./components/Container";
import Provider from "./context/Provider";
import Home from "./pages/Home";
import Main from "./pages/Main";
import PageNotFound from "./pages/NotFound";

function App() {
  return (
    <Provider>
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/main" element={<Main />} />
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </Container>
    </Provider>
  );
}

export default App;
