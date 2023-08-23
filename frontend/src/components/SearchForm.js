import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Row, Col } from 'react-bootstrap';
import { useState } from 'react';

function SearchForm({search}) {

    //const [form, setForm] = useState({name:"", init_bic:'', dest_bic:'', min_date:'2020-01-01', max_date:'2023-12-31', min_amt:'', max_amt:''});

    const [name, setName] = useState("");
    const [initBIC, setInitBIC] = useState("");
    const [destBIC, setDestBIC] = useState("");
    const [minDate, setMinDate] = useState("2020-01-01");
    const [maxDate, setMaxDate] = useState("2023-12-31");
    const [minAmt, setMinAmt] = useState('');
    const [maxAmt, setMaxAmt] = useState('');
  

    const doSearch = () => {
        const form = { name: name, init_bic: initBIC, dest_bic: destBIC, min_date: minDate, max_date: maxDate, min_amt: minAmt, max_amt: maxAmt};
        search(form);
    };

    return (
        <Form>
            <Row>
                <Col>
                    <Form.Group className="mb-3" controlId="initName">
                        <Form.Label>Initiator name</Form.Label>
                        <Form.Control type="text" value={name} onChange={event => setName(event.target.value)}/>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='initBIC'>
                        <Form.Label>Initiator BIC</Form.Label>
                        <Form.Control type="text" value={initBIC} onChange={event => setInitBIC(event.target.value)}/>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='destBIC'>
                        <Form.Label>Destination BIC</Form.Label>
                        <Form.Control type="text" value={destBIC} onChange={event => setDestBIC(event.target.value)}/>
                    </Form.Group>
                </Col>
                <Col>
                    <Row>
                        <Col>
                            <Form.Group className='mb-3' controlId='minDate'>
                                <Form.Label>Start date</Form.Label>
                                <Form.Control type="date" value={minDate}  onChange={event => setMinDate(event.target.value)}/>
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className='mb-3' controlId='maxDate'>
                                <Form.Label>End date</Form.Label>
                                <Form.Control type="date" value={maxDate} onChange={event => setMaxDate(event.target.value)}/>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className='mb-3' controlId='minAmt'>
                                <Form.Label>Minimum amount</Form.Label>
                                <Form.Control type="text" value={minAmt} onChange={event => setMinAmt(event.target.value)}/>
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className='mb-3' controlId='maxAmt'>
                                <Form.Label>Maximum amount</Form.Label>
                                <Form.Control type="text" value={maxAmt} onChange={event => setMaxAmt(event.target.value)}/>
                            </Form.Group>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button variant="primary" type="submit" onClick={event => {event.preventDefault(); doSearch()}}>Search</Button>
                </Col>
            </Row>

        </Form>
    );
}

export default SearchForm;