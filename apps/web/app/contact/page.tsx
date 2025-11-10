"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Local utility to avoid touching shared libs
function cn(...classes: Array<string | undefined | false>) {
	return classes.filter(Boolean).join(" ");
}

// Self-contained Spotlight background (mouse-follow radial + subtle grid)
function SpotlightBackground({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const containerRef = React.useRef<HTMLDivElement | null>(null);
	const targetPos = React.useRef({ x: 0, y: 0 });
	const [spotPos, setSpotPos] = React.useState({ x: 0, y: 0 });

	React.useEffect(() => {
		function handleMove(e: MouseEvent) {
			if (!containerRef.current) return;
			const rect = containerRef.current.getBoundingClientRect();
			targetPos.current = {
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
			};
		}
		const el = containerRef.current;
		el?.addEventListener("mousemove", handleMove, { passive: true });
		// Smoothly follow the cursor
		let raf = 0;
		function animate() {
			setSpotPos((prev) => {
				const dx = targetPos.current.x - prev.x;
				const dy = targetPos.current.y - prev.y;
				const easedX = prev.x + dx * 0.08;
				const easedY = prev.y + dy * 0.08;
				return { x: easedX, y: easedY };
			});
			raf = requestAnimationFrame(animate);
		}
		raf = requestAnimationFrame(animate);
		return () => {
			el?.removeEventListener("mousemove", handleMove);
			cancelAnimationFrame(raf);
		};
	}, []);

	const spotlightStyle: React.CSSProperties = {
		background: `radial-gradient(720px circle at ${spotPos.x}px ${spotPos.y}px, rgba(168, 85, 247, 0.18), transparent 45%)`,
	};

	return (
		<div
			ref={containerRef}
			className={cn(
				"relative flex min-h-screen w-full flex-col overflow-hidden bg-black antialiased",
				className
			)}
		>
			{/* Grid background */}
			<div
				aria-hidden="true"
				className={cn(
					"pointer-events-none absolute inset-0 select-none opacity-100",
					"[background-size:44px_44px]",
					"[background-image:linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)]"
				)}
			/>
			{/* Soft color wash */}
			<div
				aria-hidden="true"
				className={cn(
					"pointer-events-none absolute inset-0",
					"bg-[radial-gradient(900px_600px_at_10%_-10%,rgba(99,102,241,0.18),transparent_60%)]",
					"before:absolute before:inset-0 before:bg-[radial-gradient(900px_600px_at_90%_-10%,rgba(236,72,153,0.16),transparent_60%)]",
					"before:content-['']"
				)}
			/>
			{/* Mouse spotlight */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 transition-[background] duration-150 ease-out"
				style={spotlightStyle}
			/>
			{/* Content */}
			<div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-0">
				{children}
			</div>
		</div>
	);
}

function Field({
	label,
	id,
	type = "text",
	placeholder,
	required,
}: {
	label: string;
	id: string;
	type?: string;
	placeholder?: string;
	required?: boolean;
}) {
	return (
		<div className="space-y-2">
			<label
				htmlFor={id}
				className="block text-sm font-medium text-neutral-300"
			>
				{label}
				{required ? <span className="text-red-500"> *</span> : null}
			</label>
			<input
				id={id}
				name={id}
				type={type}
				placeholder={placeholder}
				required={required}
				className={cn(
					"w-full rounded-md border border-neutral-800 bg-neutral-900/60 px-3 py-2",
					"text-neutral-100 placeholder:text-neutral-500",
					"outline-none ring-0 focus:border-neutral-700 focus:bg-neutral-900 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.06)]",
					"transition"
				)}
			/>
		</div>
	);
}

function TextArea({
	label,
	id,
	placeholder,
	required,
	rows = 6,
}: {
	label: string;
	id: string;
	placeholder?: string;
	required?: boolean;
	rows?: number;
}) {
	return (
		<div className="space-y-2">
			<label
				htmlFor={id}
				className="block text-sm font-medium text-neutral-300"
			>
				{label}
				{required ? <span className="text-red-500"> *</span> : null}
			</label>
			<textarea
				id={id}
				name={id}
				required={required}
				rows={rows}
				placeholder={placeholder}
				className={cn(
					"w-full resize-y rounded-md border border-neutral-800 bg-neutral-900/60 px-3 py-2",
					"text-neutral-100 placeholder:text-neutral-500",
					"outline-none ring-0 focus:border-neutral-700 focus:bg-neutral-900 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.06)]",
					"transition"
				)}
			/>
		</div>
	);
}

export default function ContactPage() {
	const [status, setStatus] = React.useState<"idle" | "success" | "error">(
		"idle"
	);
	const [submitting, setSubmitting] = React.useState(false);

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setSubmitting(true);
		setStatus("idle");
		try {
			// For now, we just simulate a send. Replace with your API/email later.
			await new Promise((r) => setTimeout(r, 800));
			setStatus("success");
			(e.currentTarget as HTMLFormElement).reset();
		} catch {
			setStatus("error");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<main className="min-h-screen bg-black text-neutral-100">
			<SpotlightBackground>
				<Navbar />
				<section className="mx-auto grid min-h-[78vh] w-full max-w-7xl grid-cols-1 place-items-center gap-16 pb-28 pt-36 md:grid-cols-2 md:gap-24 md:pb-32 md:pt-40">
					<div className="flex w-full max-w-xl flex-col items-center justify-center space-y-6 text-center md:max-w-2xl">
						<h1 className="bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-4xl font-bold leading-tight text-transparent md:text-6xl">
							Let&apos;s build something great.
						</h1>
						<p className="mt-2 max-w-prose text-neutral-300 md:text-lg">
							Have a question, an idea, or want to collaborate with ACM? Drop us a
							message and we&apos;ll get back to you. We usually respond within{" "}
							<span className="text-neutral-200">2–3 business days</span>.
						</p>

						<div className="mt-8 grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
							<div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
								<p className="text-sm text-neutral-400">Email</p>
								<a
									href="mailto:contact@acm.example"
									className="mt-1 block text-lg font-medium text-neutral-100 underline-offset-4 hover:underline"
								>
									contact@acm.example
								</a>
							</div>
							<div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
								<p className="text-sm text-neutral-400">Headquarters</p>
								<p className="mt-1 text-lg font-medium text-neutral-100">
									Your Campus • CS Dept
								</p>
							</div>
						</div>

						<div className="mt-6 flex flex-wrap justify-center gap-4">
							<Link
								href="https://x.com"
								target="_blank"
								className={cn(
									"rounded-md border border-neutral-800 bg-neutral-900/40 px-4 py-2 text-sm text-neutral-200",
									"hover:border-neutral-700 hover:bg-neutral-900 transition"
								)}
							>
								Twitter/X
							</Link>
							<Link
								href="https://instagram.com"
								target="_blank"
								className={cn(
									"rounded-md border border-neutral-800 bg-neutral-900/40 px-4 py-2 text-sm text-neutral-200",
									"hover:border-neutral-700 hover:bg-neutral-900 transition"
								)}
							>
								Instagram
							</Link>
							<Link
								href="https://linkedin.com"
								target="_blank"
								className={cn(
									"rounded-md border border-neutral-800 bg-neutral-900/40 px-4 py-2 text-sm text-neutral-200",
									"hover:border-neutral-700 hover:bg-neutral-900 transition"
								)}
							>
								LinkedIn
							</Link>
						</div>
					</div>

					<div className="relative mt-6 w-full max-w-xl md:mt-2 md:max-w-2xl">
						<div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/10 to-transparent blur-3xl" />
						<form
							onSubmit={onSubmit}
							className="relative space-y-7 rounded-2xl border border-neutral-800 bg-neutral-950/60 p-7 backdrop-blur md:space-y-8 md:p-10"
						>
							<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
								<Field id="firstName" label="First name" placeholder="Ada" required />
								<Field id="lastName" label="Last name" placeholder="Lovelace" required />
							</div>
							<Field
								id="email"
								type="email"
								label="Email"
								placeholder="you@university.edu"
								required
							/>
							<Field id="subject" label="Subject" placeholder="Collaboration, sponsorship, ..." />
							<TextArea
								id="message"
								label="Message"
								placeholder="Tell us about your idea or inquiry..."
								required
								rows={8}
							/>
							<div className="flex items-center justify-between pt-2">
								<p className="text-xs text-neutral-500">
									By sending, you agree to our{" "}
									<Link
										href="/about"
										className="underline underline-offset-4 hover:text-neutral-300"
									>
										terms
									</Link>
									.
								</p>
								<button
									type="submit"
									disabled={submitting}
									className={cn(
										"rounded-md bg-white px-4 py-2 text-sm font-semibold text-black",
										"hover:bg-neutral-200 active:bg-neutral-300 transition disabled:opacity-60"
									)}
								>
									{submitting ? "Sending..." : "Send message"}
								</button>
							</div>
							{status === "success" ? (
								<p role="status" className="text-sm text-emerald-400">
									Thanks! Your message has been sent.
								</p>
							) : null}
							{status === "error" ? (
								<p role="status" className="text-sm text-red-400">
									Something went wrong. Please try again.
								</p>
							) : null}
						</form>
					</div>
				</section>
				<Footer />
			</SpotlightBackground>
		</main>
	);
}


