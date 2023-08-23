import {Container, Row, Col, Table, Button} from "react-bootstrap";
import Dt from './Dt';
import Amount from "./Amount";
import { useState } from 'react';
import Details from "./Details";
import axios from "axios";
import "./Results.css";

function Count({count}) {
    if (count === -1) {
        return (<span className="loader"/>);
    } else {
        const formatted = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(count);
        return (<span>{formatted} results</span>);
    }
}

function NextPage({results, next}) {
    if (results.hasNext) {
        return (<Button variant='primary' onClick={next}>Next page</Button>)
    }
}

function Results({results, count, next}) {

    const [ selected, setSelected ] = useState(null);

    const viewDetails = (_id) => {
        axios.get(`http://localhost:8000/details/${_id}`).then((response) => {
            const data = response.data;
            delete data._id;
            setSelected(JSON.stringify(data, null, 4));
        });
    };

    if (results === null || results.results.length === 0) {
        return (<p>No results</p>);
    }

    return (
        <Container>
            <Row>
                <Col>
                    <Table striped bordered>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Initiator name</th>
                                <th>Initiator BIC</th>
                                <th>Destination BIC</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.results.map((res, i) => <tr className="clickable" key={i} onClick={() => viewDetails(res._id)}>
                                <td><Dt date={res.date}/></td>
                                <td>{res.name}</td>
                                <td>{res.init_bic}</td>
                                <td>{res.dest_bic}</td>
                                <td><Amount amt={res.amt}/></td>
                            </tr>)}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col><Count count={count}/> <NextPage results={results} next={next}/></Col>
            </Row>
            
            <Details selected={selected} setSelected={setSelected}/>
        </Container>
    );
}

export default Results;