import Weather from "./components/DisplayWeather";
import Layout from "./components/layout";
import "./styles/styles.scss";

const App = () => {
  return (
    <>
      <Layout>
        <Weather />
      </Layout>
    </>
  );
};

export default App;
