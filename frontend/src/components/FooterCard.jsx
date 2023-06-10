function FooterCard() {
    return (
        <div className="contaner-fluid mt-5 mb-10">
            <div className="row">
                <div className="col-4">
                    <h3>Hours and Contact</h3>
                    <p>
                        Open every day from 11AM - midnight

                        Contact us at 222-2222 and allow us to serve you tonight!
                    </p>
                </div>
                <div className="col-4">
                    <h3>Current Specials</h3>
                    <ul>
                        <li>Pizza Fingers: $2.50</li>
                        <li>Large Deluxe: $15.00</li>
                    </ul>
                </div>
                <div className="col-4">
                    <h3>About us</h3>
                    <p>We are a family-owned business that has been serving up pizza goodness for 23 years! We're world famous for pizza fingers!</p>
                </div>
            </div>
        </div>
    )
}

export default FooterCard;