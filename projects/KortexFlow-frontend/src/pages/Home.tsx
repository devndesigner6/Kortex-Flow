import React from "react";
import AppCalls from "../components/AppCalls";

export const Home: React.FC = () => {
    const [openModal, setModalState] = React.useState(false);

    return (
        <div className="container mx-auto px-4">
            <div className="min-h-screen flex flex-col justify-center items-center">
                <h1 className="text-4xl font-bold mb-8">KortexFlow Demo</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => setModalState(true)}
                >
                    Make an App Call
                </button>
                <AppCalls openModal={openModal} setModalState={setModalState} />
            </div>
        </div>
    );
};
