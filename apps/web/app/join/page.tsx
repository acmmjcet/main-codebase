"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function JoinPage() {
	const [dots, setDots] = React.useState(".");
	React.useEffect(() => {
		const id = setInterval(() => {
			setDots((d) => (d.length >= 3 ? "." : d + "."));
		}, 500);
		return () => clearInterval(id);
	}, []);

	return (
		<main className="min-h-screen bg-black text-neutral-100">
			{/* Background */}
			<div className="pointer-events-none fixed inset-0 -z-10">
				{/* Subtle grid */}
				<div
					className="absolute inset-0 opacity-30"
					style={{
						backgroundSize: "44px 44px",
						backgroundImage:
							"linear-gradient(to right, #111111 1px, transparent 1px), linear-gradient(to bottom, #111111 1px, transparent 1px)",
					}}
				/>
				{/* Animated gradient orbs */}
				<div className="absolute left-[15%] top-[5%] h-[520px] w-[520px] -translate-y-1/3 rounded-full bg-indigo-500/20 blur-3xl animate-float-slow" />
				<div className="absolute right-[15%] bottom-[5%] h-[520px] w-[520px] translate-y-1/3 rounded-full bg-fuchsia-500/20 blur-3xl animate-float-slower" />
				{/* Moving light sweep */}
				<div className="absolute inset-0 bg-[radial-gradient(800px_600px_at_50%_20%,rgba(255,255,255,0.06),transparent_60%)]" />
				<div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.05),transparent)] animate-sheen" />
			</div>

			<Navbar />

			<section className="mx-auto flex min-h-[80vh] w-full max-w-6xl flex-col items-center justify-center px-6 text-center">
				<h1 className="bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-4xl font-extrabold leading-tight text-transparent md:text-6xl">
					Core Team Interviews
				</h1>
				<p className="mt-4 max-w-2xl text-neutral-300 md:text-lg">
					Coming soon<span className="inline-block w-6">{dots}</span> Sush!!!
				</p>

				<div className="mt-12 flex items-center gap-3 text-sm text-neutral-400">
					<div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
					<span>Stay tuned for updates on this page.</span>
				</div>

				<div className="pointer-events-none relative mt-16 w-full max-w-3xl overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
					<div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/10 to-transparent blur-3xl" />
					<p className="text-neutral-400">
						We&apos;re crafting an application and interview experience to spotlight
						your passion and impact at ACM MJCET.
					</p>
				</div>
			</section>

			<Footer />
			<style jsx>{`
				@keyframes float-slow {
					0% { transform: translateY(-33%) translateX(0); }
					50% { transform: translateY(-25%) translateX(30px); }
					100% { transform: translateY(-33%) translateX(0); }
				}
				@keyframes float-slower {
					0% { transform: translateY(33%) translateX(0); }
					50% { transform: translateY(25%) translateX(-30px); }
					100% { transform: translateY(33%) translateX(0); }
				}
				@keyframes sheen {
					0% { transform: translateX(-100%); opacity: 0; }
					20% { opacity: 1; }
					80% { opacity: 1; }
					100% { transform: translateX(100%); opacity: 0; }
				}
				.animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
				.animate-float-slower { animation: float-slower 14s ease-in-out infinite; }
				.animate-sheen { animation: sheen 6s linear infinite; }
			`}</style>
		</main>
	);
}


