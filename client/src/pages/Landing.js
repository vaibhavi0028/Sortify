import React, { useRef } from "react";
import "../styles/Landing.css";
import { motion } from "framer-motion";
import { ReactTyped } from "react-typed";
import { useLocation } from "react-router-dom";
import { MdEmail, MdAssignment, MdReportProblem, MdCleanHands } from "react-icons/md";
import Footer from "../components/Footer";
import HeroImage from "../assets/landing.png";

const LandingPage = () => {
    const featuresRef = useRef(null);

    const handleScroll = () => {
        if (featuresRef.current) {
            featuresRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const location = useLocation();
    
    return (
        <div className="landing-page">
            <section className="hero">
                <div className="hero-text">
                    <motion.h1
                        className="typed-text"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                    >
                        <ReactTyped
                            strings={["Welcome to Sortify", "Simplify Your Daily VIT Tasks"]}
                            typeSpeed={100}
                            backSpeed={80}
                            loop
                        />
                    </motion.h1>
                    <p>
                        Sortify streamlines your VIT experience by automating mail
                        segregation, generating personalized emails, handling hostel
                        complaints, service requests, and offering real-time tracking
                        through a user-friendly interface.
                    </p>
                    <div className="button-group">
                        <button onClick={handleScroll} className="cta-button">
                            Get Started
                        </button>
                        <a href="/auth/signin" className="cta-button cta-signin">
                            Sign In
                        </a>
                    </div>
                </div>
                <div className="hero-image">
                    <img src={HeroImage} alt="Sortify Hero" />
                </div>
            </section>

            <section ref={featuresRef} id="features" className="features">
                <h2>Why Choose Sortify?</h2>

                <div className="feature-container">
                    <div className="feature-box">
                        <MdEmail size={60} />
                        <h3>Smart Mail Segregation</h3>
                        <p>
                            Sortify categorizes your emails based on your interests—sports,
                            internship opportunities, class updates, proctor messages, and
                            more—keeping your inbox organized and visually appealing.
                        </p>
                    </div>

                    <div className="feature-box">
                        <MdAssignment size={60} />
                        <h3>Personalized Mail Generator</h3>
                        <p>
                            Automate the process of drafting and sending emails to proctors,
                            wardens, and faculty for leaves or queries. Compose your messages
                            with ease and efficiency.
                        </p>
                    </div>

                    <div className="feature-box">
                        <MdReportProblem size={60} />
                        <h3>Effortless Complaints and Requests</h3>
                        <p>
                            Say goodbye to the hassle of paperwork. Report issues like
                            sanitation problems, room cleaning, or repairs directly to your
                            hostel warden with just a few clicks.
                        </p>
                    </div>

                    <div className="feature-box">
                        <MdCleanHands size={60} />
                        <h3>Instant Service Requests</h3>
                        <p>
                            Schedule room cleaning or request repairs for AC, electrical, or
                            plumbing issues in seconds—no more waiting, just fast action.
                        </p>
                    </div>
                </div>
            </section>

            <section className="how-it-works">
            
                <h2>How It Works</h2>
                <div className="steps-container">
                    <div className="step-box">
                        <span className="step-number">1</span>
                        <h3>Sign Up</h3>
                        <p>Create your account and connect with your email.</p>
                    </div>

                    <div className="step-box">
                        <span className="step-number">2</span>
                        <h3>Mail Segregation</h3>
                        <p>
                            Stay on top of your VIT emails effortlessly. Sortify categorizes
                            your emails based on your interests, helping you keep your inbox
                            organized and visually appealing.
                        </p>
                    </div>

                    <div className="step-box">
                        <span className="step-number">3</span>
                        <h3>Personalized Mail Generator</h3>
                        <p>
                            Automate the process of drafting and sending emails to proctors,
                            wardens, and faculty for leaves or queries, allowing you to
                            compose messages with ease.
                        </p>
                    </div>

                    <div className="step-box">
                        <span className="step-number">4</span>
                        <h3>Effortless Complaints and Requests</h3>
                        <p>
                            Report issues directly to your hostel warden with just a few
                            clicks, eliminating the hassle of paperwork.
                        </p>
                    </div>

                    <div className="step-box">
                        <span className="step-number">5</span>
                        <h3>Instant Service Requests</h3>
                        <p>
                            Schedule room cleaning or request repairs for AC, electrical, or
                            plumbing issues in seconds—no more waiting, just fast action.
                        </p>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <h2>Ready to Take Control of Your Inbox?</h2>
                <a href="/auth/signup" className="cta-button cta-large">
                    Try Sortify Now
                </a>
            </section>
            <Footer />
        </div>
    );
};

export default LandingPage;
