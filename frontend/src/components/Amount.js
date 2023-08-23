
const Amount = ({amt}) => {
    const fmtAmt = new Intl.NumberFormat('en-US', {
        style:"currency",
        currency:"EUR",
        maximumFractionDigits: 0
    }).format(amt);
    return fmtAmt;
};

export default Amount;
