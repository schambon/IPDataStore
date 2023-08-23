import { Modal } from "react-bootstrap";
import './Details.css'

function Details({selected, setSelected}) {
    if (selected === null || selected === undefined) {
        return null;
    }

    return (
        <Modal className="bigmodal" show={true} onHide={() => setSelected(null)}>
            <Modal.Header closeButton>
                <Modal.Title>Transaction details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="codeblock">{selected}</p>
            </Modal.Body>
        </Modal>
    );

    // return (
    // <div>
    //     <p className="codeblock">{selected}</p>
    //     <Button onClick={() => setSelected(null)}>reset</Button>
    // </div>);
}

export default Details;