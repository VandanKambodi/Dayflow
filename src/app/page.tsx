"use client";

import { useCurrentUserClient } from "@/hook/use-current-user";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Users,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  Lock,
} from "lucide-react";

export default function Home() {
  const { user: session, status } = useCurrentUserClient();
  const router = useRouter();

  // --- ANIMATION STATES ---
  const [isMounted, setIsMounted] = useState(false);
  
  // Entrance States
  const [slideUp, setSlideUp] = useState(false); // Entrance curtain moves UP away
  const [removeLoader, setRemoveLoader] = useState(false); 

  // Exit State
  const [isExiting, setIsExiting] = useState(false); // Exit curtain moves UP to cover

  useEffect(() => {
    setIsMounted(true);

    // 1. Entrance Animation Sequence
    const slideTimer = setTimeout(() => {
      setSlideUp(true);
    }, 2000); 

    const removeTimer = setTimeout(() => {
      setRemoveLoader(true);
    }, 3200);

    return () => {
      clearTimeout(slideTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  // --- HANDLE EXIT NAVIGATION ---
  const handleNavigation = (path: string) => {
    // 1. Trigger the Exit Animation (Slide shutter up)
    setIsExiting(true);

    // 2. Wait for animation to finish (1s), then navigate
    setTimeout(() => {
      router.push(path);
    }, 1000); 
  };

  // Redirect logged-in users
  if (session && status === "authenticated") {
    // Optionally apply the same exit logic here if you want instant redirect animation
    // But usually we just return null or redirect fast
    router.push("/dashboard");
    return null;
  }

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-black text-[#CFCBC8] selection:bg-[#CFCBC8] selection:text-black overflow-x-hidden relative">
      
      {/* ================= EXIT SHUTTER (SLIDES UP FROM BOTTOM) ================= */}
      {/* This layer sits below the viewport until isExiting becomes true */}
      <div 
        className={`fixed inset-0 z-[9999] pointer-events-none transition-transform duration-1000 ease-[cubic-bezier(0.87,0,0.13,1)] ${
          isExiting ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Metallic Top Edge */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[#CFCBC8] " />
        
        {/* Main Black Cover */}
        <div className="absolute inset-0 bg-black flex items-center justify-center">
             <div className="animate-pulse flex flex-col items-center gap-4">
                {/* <h2 className="text-3xl font-bold tracking-[0.2em] text-[#CFCBC8]">PROCESSING</h2>
                <div className="h-[1px] w-12 bg-[#CFCBC8]/50" /> */}
             </div>
        </div>
      </div>


      {/* ================= ENTRANCE SLIDER LOADER ================= */}
      {!removeLoader && (
        <>
          {/* Layer 1: Metallic Divider */}
          <div
            className={`fixed inset-0 z-[100] bg-[#CFCBC8] transition-transform duration-[1000ms] ease-[cubic-bezier(0.87,0,0.13,1)] ${
              slideUp ? "-translate-y-full" : "translate-y-0"
            }`}
          />
          
          {/* Layer 2: Main Black Cover */}
          <div
            className={`fixed inset-0 z-[101] flex flex-col items-center justify-center bg-black transition-transform duration-[1200ms] delay-100 ease-[cubic-bezier(0.87,0,0.13,1)] ${
              slideUp ? "-translate-y-full" : "translate-y-0"
            }`}
          >
            {/* Logo Animation */}
            <div className="relative">
              <h1 className="text-4xl md:text-6xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#CFCBC8] to-[#666] animate-pulse">
                SOURCER
              </h1>
            </div>

            {/* Loading Bar */}
            <div className="mt-8 h-[2px] w-48 bg-[#CFCBC8]/20 overflow-hidden rounded-full">
              <div className="h-full w-full bg-[#CFCBC8] animate-[progress_1.5s_ease-in-out_infinite] origin-left" />
            </div>
            
            <p className="mt-4 text-xs font-mono text-[#CFCBC8]/50 tracking-widest uppercase">
              Initializing System
            </p>
          </div>
        </>
      )}

      {/* ================= BACKGROUND ================= */}
      <div className="fixed inset-0 z-0 h-full w-full bg-black bg-[linear-gradient(to_right,#cfcbc80a_1px,transparent_1px),linear-gradient(to_bottom,#cfcbc80a_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-[#CFCBC8] opacity-10 blur-[100px]"></div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-[#CFCBC8]/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-[#CFCBC8] to-[#999]">
              sourcer
            </h1>
          </div>

          <nav className="flex items-center gap-6">
            <button
              onClick={() => handleNavigation("/auth/login")}
              className="text-sm font-medium text-[#CFCBC8]/70 hover:text-[#CFCBC8] transition-colors"
            >
              Login
            </button>
            <Button 
                onClick={() => handleNavigation("/auth/signup")}
                className="bg-[#CFCBC8] text-black hover:bg-[#EAE8E6] transition-all duration-300 font-semibold shadow-[0_0_15px_-3px_rgba(207,203,200,0.3)]"
            >
              Get Started
            </Button>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">

        

        <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <span className="bg-gradient-to-b from-[#CFCBC8] via-[#E6E2DF] to-[#666] bg-clip-text text-transparent">
            Modern HR Management
          </span>
          <br />
          <span className="text-[#CFCBC8]/40">For The Future.</span>
        </h2>

        <p className="mt-6 max-w-2xl mx-auto text-[#CFCBC8]/60 text-lg md:text-xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          Sourcer streamlines your workforce operations. Manage authentication,
          roles, and company data in one distinct, secure environment.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Button 
                onClick={() => handleNavigation("/auth/signup")}
                className="h-12 px-8 text-base bg-[#CFCBC8] text-black hover:bg-[#EAE8E6] transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_-5px_rgba(207,203,200,0.4)]"
            >
              Start Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              onClick={() => handleNavigation("/auth/login")}
              variant="outline"
              className="h-12 px-8 text-base border-[#CFCBC8]/30 text-[#CFCBC8] hover:bg-[#CFCBC8]/10 hover:text-[#CFCBC8] hover:border-[#CFCBC8]"
            >
              Login
            </Button>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="relative z-10 py-24 border-t border-[#CFCBC8]/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-[#CFCBC8] to-[#888] bg-clip-text text-transparent mb-4">
              Why Leaders Choose Sourcer
            </h3>
            <p className="text-[#CFCBC8]/50">
              Built for speed, security, and scalability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Bank-Grade Security"
              description="Enterprise-ready role-based authentication ensures your data stays within the right hands."
            />

            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Unified Profiles"
              description="Centralized employee dashboard combining personal details, roles, and performance data."
            />

            <FeatureCard
              icon={<Briefcase className="h-6 w-6" />}
              title="Scalable Architecture"
              description="Whether you are a team of 10 or 10,000, Sourcer's infrastructure scales effortlessly."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative z-10 py-24 border-t border-[#CFCBC8]/10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-16 text-center">
            <h3 className="text-3xl font-bold text-[#CFCBC8]">
              Streamlined Workflow
            </h3>
          </div>

          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#CFCBC8]/30 before:to-transparent">
            <StepCard
              number="01"
              title="Create Organization"
              description="Sign up as an Admin and set up your company profile in seconds."
              align="left"
              icon={<LayoutDashboard className="h-5 w-5" />}
            />
            <StepCard
              number="02"
              title="Manage Permissions"
              description="Define roles and invite employees with secure, magic-link invitations."
              align="right"
              icon={<Lock className="h-5 w-5" />}
            />
            <StepCard
              number="03"
              title="Automate Operations"
              description="Let Sourcer handle the data while you focus on growing your team."
              align="left"
              icon={<CheckCircle2 className="h-5 w-5" />}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl border border-[#CFCBC8]/30 bg-gradient-to-b from-[#CFCBC8]/10 to-black p-12 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#CFCBC8] opacity-10 blur-[80px]"></div>
            
            <h3 className="relative z-10 text-3xl md:text-4xl font-bold text-[#CFCBC8] mb-6">
              Ready to upgrade your workflow?
            </h3>
            <p className="relative z-10 text-[#CFCBC8]/60 mb-10 max-w-lg mx-auto">
              Join forward-thinking companies using Sourcer to manage their
              workforce efficiently.
            </p>
            <div className="relative z-10">
                <Button 
                    onClick={() => handleNavigation("/auth/signup")}
                    className="h-14 px-10 text-lg bg-[#CFCBC8] text-black hover:bg-[#fff] transition-all shadow-[0_0_30px_-5px_rgba(207,203,200,0.3)]"
                >
                  Get Started Now
                </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[#CFCBC8]/10 py-10 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2 opacity-50">
            <span className="font-semibold text-[#CFCBC8]">sourcer</span>
          </div>
          <p className="text-sm text-[#CFCBC8]/40">
            © {new Date().getFullYear()} sourcer Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-[#CFCBC8]/40">
            <button className="hover:text-[#CFCBC8] transition-colors">Privacy</button>
            <button className="hover:text-[#CFCBC8] transition-colors">Terms</button>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ================= COMPONENTS ================= */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#CFCBC8]/10 bg-zinc-900/30 p-8 transition-all hover:border-[#CFCBC8]/30 hover:bg-zinc-900/50 hover:shadow-[0_0_40px_-10px_rgba(207,203,200,0.1)]">
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#CFCBC8]/5 text-[#CFCBC8] group-hover:bg-[#CFCBC8] group-hover:text-black transition-colors duration-300">
        {icon}
      </div>
      <h4 className="font-bold text-xl mb-3 text-[#CFCBC8]">{title}</h4>
      <p className="text-sm text-[#CFCBC8]/50 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
  align,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  align: "left" | "right";
  icon: React.ReactNode;
}) {
  return (
    <div
      className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group ${
        align === "left" ? "md:flex-row" : ""
      }`}
    >
      {/* Icon Node on Line */}
      <div className="absolute left-0 md:left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-[#CFCBC8]/30 bg-black text-[#CFCBC8] shadow-[0_0_0_4px_#000] group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>

      {/* Content */}
      <div className="ml-16 md:ml-0 md:w-[45%] p-6 rounded-xl border border-[#CFCBC8]/10 bg-zinc-900/20 hover:border-[#CFCBC8]/30 transition-colors">
        <span className="block text-4xl font-bold text-[#CFCBC8]/10 mb-2">
          {number}
        </span>
        <h4 className="font-bold text-lg text-[#CFCBC8] mb-2">{title}</h4>
        <p className="text-sm text-[#CFCBC8]/50">{description}</p>
      </div>
    </div>
  );
}