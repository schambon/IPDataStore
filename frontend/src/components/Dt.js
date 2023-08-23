const Dt = ({date}) => {
    const fmt = new Intl.DateTimeFormat('fr-FR', {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: "Europe/Paris",
        timeZoneName: "short",
        hour12: false
    });

    if (typeof(date) === "object") {
        const d = new Date(date["$date"]);
        return fmt.format(d);
    } else {
        const d = new Date(date);
        return fmt.format(d);
    }
};

export default Dt;
