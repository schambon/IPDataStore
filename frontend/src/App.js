
import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import SearchForm from './components/SearchForm';
import Results from './components/Results';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import axios from 'axios';

function App() {

  const [results, setResults] = useState(null);
  const [count, setCount] = useState(-1);
  const [form, setForm] = useState(null);
  const [start, setStart] = useState(0);
  
  const doSearch = async (criteria) => {
    setForm(criteria);
    setStart(0);
    setResults(null);
    setCount(-1);

    axios.post("http://localhost:8000/search", criteria).then(response => {
      setResults(response.data);
    });
    axios.post("http://localhost:8000/count", criteria).then(response => {
      console.log("count", JSON.stringify(response.data));
      setCount(response.data.count);
    });
  };

  const nextPage = async () => {
    const newStart = start + 100;
    setStart(newStart);

    axios.post(`http://localhost:8000/search?start=${newStart}`, form).then(response => {
      console.log("results", JSON.stringify(response.data));
      setResults(response.data);
    });
  }

  return (
    <Container fluid>
      <Row xs={10} className="searchForm">
        <Col>
          <SearchForm search={doSearch}/>
        </Col>
      </Row>
      <Row xs={10} className="result">
        <Col>
          <Results results={results} count={count} next={nextPage}/>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
