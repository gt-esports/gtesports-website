import { FaGamepad, FaUsers, FaArrowRight, FaDiscord } from "react-icons/fa";

function HomeAbout() {
    return (
        <section className="relative w-full bg-deep-space py-20 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="grid gap-8 md:grid-cols-2">
                    {/* Competitive Card */}
                    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition-all hover:border-tech-gold/50 hover:bg-white/10">
                        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-tech-gold/10 blur-3xl transition-all group-hover:bg-tech-gold/20"></div>

                        <div className="relative z-10 flex flex-col items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-tech-gold to-gold-glow text-white shadow-lg">
                                <FaGamepad className="text-2xl" />
                            </div>

                            <h3 className="font-outfit text-3xl font-bold uppercase text-white">
                                Competitive
                            </h3>

                            <div className="space-y-4 font-inter text-gray-400">
                                <p>
                                    Represent Georgia Tech Esports in the highest levels of collegiate esports. We participate in major leagues like NACE, CLoL, and more, offering travel opportunities and the chance to compete on the big stage.
                                </p>
                                <p>
                                    Join our Main Discord for general updates, but be sure to check out our <span className="text-tech-gold">Games Page</span> to find the specific Discord community and tryout information for your game of choice.
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 mt-8 flex flex-wrap gap-4">
                            <a href="/games" className="group/btn flex items-center gap-2 rounded-full bg-tech-gold px-6 py-3 font-outfit text-sm font-bold text-white transition-all hover:bg-white hover:text-deep-space">
                                VIEW TEAMS <FaArrowRight className="transition-transform group-hover/btn:translate-x-1" />
                            </a>
                            <a href="https://discord.gg/uwdSHXq4sN" target="_blank" rel="noreferrer" className="group/btn flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 font-outfit text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/40">
                                MAIN DISCORD <FaDiscord />
                            </a>
                        </div>
                    </div>

                    {/* Community Card */}
                    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition-all hover:border-blue-400/50 hover:bg-white/10">
                        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl transition-all group-hover:bg-blue-500/20"></div>

                        <div className="relative z-10 flex flex-col items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg">
                                <FaUsers className="text-2xl" />
                            </div>

                            <h3 className="font-outfit text-3xl font-bold uppercase text-white">
                                Community
                            </h3>

                            <div className="space-y-4 font-inter text-gray-400">
                                <p>
                                    Gaming is for everyone. You don't need to be a top-tier player to be part of GT Esports.
                                </p>
                                <p>
                                    We host regular LAN parties, watch parties, and casual game nights that are open to all students. It's the perfect place to make friends, de-stress from classes, and enjoy the social side of gaming.
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 mt-8">
                            <a href="https://discord.gg/uwdSHXq4sN" target="_blank" rel="noreferrer" className="group/btn flex w-fit items-center gap-2 rounded-full bg-blue-500 px-6 py-3 font-outfit text-sm font-bold text-white transition-all hover:bg-blue-400">
                                JOIN THE COMMUNITY <FaDiscord />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomeAbout;
