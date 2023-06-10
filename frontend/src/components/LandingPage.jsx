import IntroductionCard from "./IntroductionCard";
import NavBar from "./NavBar";
import FooterCard from "./FooterCard";

function LandingPage() {
    return (
        <div className="container-fluid">
            <NavBar />
            <div className="mx-auto" style={{width: '95%'}}>
            <IntroductionCard />
            <FooterCard />
            </div>
        </div>
    )
}

export default LandingPage;