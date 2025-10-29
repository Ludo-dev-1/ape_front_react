import apeLogo from "../assets/apeLogo.jpg";

export default function Hero() {
    return (
        <section className="bg-slate-950 py-28 mb-12 text-white">
            <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center gap-10">
                <div className="md:w-1/2">
                    <h1 className="text-5xl font-bold mb-4">
                        Bienvenue sur le site de l'APE de l'école Jacques Charpentreau
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Association pour le financement des animations culturelles et
                        pédagogiques des enfants.
                    </p>
                </div>
                <div className="md:w-1/2">
                    <img
                        src={apeLogo}
                        alt="Accueil"
                        className="rounded-lg shadow-md w-2/3 h-auto m-auto"
                    />
                </div>
            </div>
        </section>
    );
}
