import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Sparkles,
} from "lucide-react";
import HeroSection from "@/components/hero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { features } from "@/data/features";
import { testimonial } from "@/data/testimonial";
import { faqs } from "@/data/faqs";
import { howItWorks } from "@/data/howItWorks";

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="w-full py-16 md:py-24 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-3xl md:text-5xl font-extrabold tracking-tight text-transparent">
              Powerful Features for Your Career Growth
            </h2>
            <p className="text-slate-400 text-lg">
              Intelligent tooling designed to give you an unfair advantage in today&apos;s competitive job market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-2 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/40 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]"
              >
                <div className="pointer-events-none absolute -top-12 -right-12 h-28 w-28 rounded-full bg-violet-600/10 blur-xl group-hover:bg-violet-600/20 transition-all duration-500" />
                <CardContent className="pt-6 text-center flex flex-col items-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)] group-hover:border-indigo-500/40 group-hover:scale-110 transition-all duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-200 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Neon Cyan & Emerald Highlights */}
      <section className="w-full py-16 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative rounded-3xl border border-white/10 bg-slate-900/40 p-8 md:p-12 backdrop-blur-2xl shadow-2xl max-w-5xl mx-auto">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-cyan-500/5 via-violet-600/5 to-emerald-500/5 rounded-3xl" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-2">
                <h3 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  50+
                </h3>
                <p className="text-slate-300 text-sm font-medium">Industries Covered</p>
              </div>

              <div className="flex flex-col items-center justify-center space-y-2">
                <h3 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                  1000+
                </h3>
                <p className="text-slate-300 text-sm font-medium">Interview Questions</p>
              </div>

              <div className="flex flex-col items-center justify-center space-y-2">
                <h3 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  95%
                </h3>
                <p className="text-slate-300 text-sm font-medium">Success Rate</p>
              </div>

              <div className="flex flex-col items-center justify-center space-y-2">
                <h3 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                  24/7
                </h3>
                <p className="text-slate-300 text-sm font-medium">AI Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-16 md:py-24 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-3xl md:text-5xl font-extrabold tracking-tight text-transparent">
              How It Works
            </h2>
            <p className="text-slate-400 text-lg">
              Four simple steps to accelerate your career growth with AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {howItWorks.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur-lg hover:border-white/10 transition-all"
              >
                <div className="w-16 h-16 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg text-white">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-16 md:py-24 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-3xl md:text-5xl font-extrabold tracking-tight text-transparent">
              What Our Users Say
            </h2>
            <p className="text-slate-400 text-lg">
              Trusted by ambitious engineers, designers, and managers worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonial.map((item, index) => (
              <Card
                key={index}
                className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl p-2 hover:border-white/20 transition-all"
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <Image
                          width={48}
                          height={48}
                          src={item.image}
                          alt={item.author}
                          className="rounded-full object-cover border-2 border-indigo-500/30 ring-2 ring-violet-500/20"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{item.author}</p>
                        <p className="text-xs text-slate-400">
                          {item.role}
                        </p>
                        <p className="text-xs text-indigo-400 font-medium">
                          {item.company}
                        </p>
                      </div>
                    </div>
                    <blockquote>
                      <p className="text-slate-300 text-sm leading-relaxed italic relative">
                        <span className="text-2xl text-indigo-400 font-serif mr-1">
                          &ldquo;
                        </span>
                        {item.quote}
                        <span className="text-2xl text-indigo-400 font-serif ml-1">
                          &rdquo;
                        </span>
                      </p>
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-16 md:py-24 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-3xl md:text-5xl font-extrabold tracking-tight text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-lg">
              Find answers to common questions about SENSAI and its AI capabilities
            </p>
          </div>

          <div className="max-w-3xl mx-auto rounded-2xl border border-white/10 bg-slate-900/50 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
                  <AccordionTrigger className="text-left text-slate-200 hover:text-white font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 text-sm leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-violet-900/60 via-indigo-900/50 to-slate-900/80 p-12 md:p-20 text-center backdrop-blur-2xl shadow-2xl max-w-5xl mx-auto">
            {/* Ambient Halos inside CTA */}
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-violet-500/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 right-10 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center justify-center space-y-6 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold text-indigo-200 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                <span>Supercharge Your Career Today</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
                Ready to Accelerate Your Career?
              </h2>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                Join thousands of ambitious professionals who are leveling up their salaries, interviews, and resumes with SENSAI.
              </p>
              <Link href="/dashboard" passHref>
                <Button
                  size="lg"
                  className="mt-4 h-12 px-8 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 text-white font-semibold shadow-lg shadow-indigo-950/50 hover:shadow-[0_0_30px_rgba(124,58,237,0.55)] hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Start Your Journey Today <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
