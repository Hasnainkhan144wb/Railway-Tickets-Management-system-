import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import StatsTestimonials from "../components/StatsTestimonials";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";

const Home = () => {
    useEffect(() => {
        document.title = "RailWay Tickets - Book Train Tickets Online | Easy & Secure";
    }, []);

    return (
        <div className="flex flex-col min-h-screen overflow-x-hidden scroll-smooth">
            <Navbar />
            <main className="flex-grow">
                <Hero />
                <Features />
                <StatsTestimonials />
            </main>
            <Footer />
            <Chatbot />
        </div>
    );
};

export default Home;