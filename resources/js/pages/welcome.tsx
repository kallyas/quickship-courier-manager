"use client"

import type React from "react"

import AppLogo from "@/components/app-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { SharedData } from "@/types"
import { Head, Link, usePage } from "@inertiajs/react"
import {
    ArrowRight,
    Clock,
    CreditCard,
    Globe,
    Mail,
    MapPin,
    Package,
    Phone,
    Search,
    Shield,
    Star,
    Users,
    Zap,
    CheckCircle,
    Award,
} from "lucide-react"
import { useState } from "react"

export default function Welcome() {
    const { auth } = usePage<SharedData>().props
    const [trackingId, setTrackingId] = useState("")

    const features = [
        {
            icon: Zap,
            title: "Lightning Fast",
            description: "Same-day delivery available with our express network across major cities",
            accent: "bg-chart-1",
        },
        {
            icon: Shield,
            title: "Fully Insured",
            description: "Complete protection with real-time monitoring and secure handling",
            accent: "bg-chart-2",
        },
        {
            icon: MapPin,
            title: "Live Tracking",
            description: "GPS-powered tracking with instant notifications and delivery updates",
            accent: "bg-chart-3",
        },
        {
            icon: CreditCard,
            title: "Flexible Payment",
            description: "Pay online, on delivery, or set up business accounts with invoicing",
            accent: "bg-chart-4",
        },
        {
            icon: Users,
            title: "Expert Support",
            description: "Dedicated support team available 24/7 via chat, phone, or email",
            accent: "bg-chart-5",
        },
        {
            icon: Globe,
            title: "Global Reach",
            description: "International shipping with customs handling and door-to-door service",
            accent: "bg-chart-1",
        },
    ]

    const testimonials = [
        {
            name: "Sarah Chen",
            role: "E-commerce Founder",
            content:
                "QuickShip transformed our fulfillment process. Our customers love the tracking experience and we've seen 40% fewer support tickets.",
            rating: 5,
            company: "TechStyle Co.",
        },
        {
            name: "Marcus Rodriguez",
            role: "Operations Director",
            content:
                "The API integration was seamless and their enterprise features have scaled perfectly with our growth from 100 to 10,000 daily shipments.",
            rating: 5,
            company: "LogiFlow Inc.",
        },
        {
            name: "Emily Watson",
            role: "Small Business Owner",
            content:
                "Finally, a courier service that understands small businesses. Competitive pricing and reliability that big companies get.",
            rating: 5,
            company: "Artisan Crafts",
        },
    ]

    const stats = [
        { number: "2M+", label: "Packages Delivered", icon: Package, accent: "text-chart-1" },
        { number: "99.8%", label: "On-Time Rate", icon: Clock, accent: "text-chart-2" },
        { number: "<2min", label: "Avg Response Time", icon: Zap, accent: "text-chart-3" },
        { number: "150+", label: "Cities Covered", icon: Globe, accent: "text-chart-4" },
    ]

    const processSteps = [
        {
            step: "01",
            title: "Create & Quote",
            description:
                "Enter your shipment details and get instant pricing from multiple carriers. Compare options and choose what works best.",
            icon: Package,
        },
        {
            step: "02",
            title: "Schedule Pickup",
            description:
                "Book a pickup time that works for you. Our drivers will collect your package with a smile and a scan.",
            icon: Clock,
        },
        {
            step: "03",
            title: "Track & Deliver",
            description:
                "Follow your package every step of the way with real-time updates. Get notified when it's delivered safely.",
            icon: CheckCircle,
        },
    ]

    const handleTrackingSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (trackingId.trim()) {
            window.location.href = `/track?id=${encodeURIComponent(trackingId.trim())}`
        }
    }

    return (
        <>
            <Head title="QuickShip - Modern Courier Service That Delivers" />

            <div className="min-h-screen bg-background font-sans">
                {/* Navigation */}
                <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm">
                                    <AppLogo />
                                </div>
                                <span className="text-xl font-bold text-foreground">QuickShip</span>
                            </div>

                            <div className="hidden items-center space-x-8 md:flex">
                                <a
                                    href="#features"
                                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Features
                                </a>
                                <a
                                    href="#pricing"
                                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Pricing
                                </a>
                                <a
                                    href="#contact"
                                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Contact
                                </a>
                                <Link
                                    href={route("tracking.index")}
                                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Track Package
                                </Link>
                            </div>

                            <div className="flex items-center gap-3">
                                {auth.user ? (
                                    <Link href={route("dashboard")}>
                                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Dashboard</Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={route("login")}>
                                            <Button variant="ghost" size="sm">
                                                Sign In
                                            </Button>
                                        </Link>
                                        <Link href={route("register")}>
                                            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                                Get Started
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-32">
                    <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/20" />
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <Badge variant="secondary" className="mb-6 bg-muted text-muted-foreground border-border">
                                <Zap className="mr-1.5 h-3 w-3" />
                                Now with same-day delivery
                            </Badge>

                            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                                Ship smarter,
                                <br />
                                <span className="relative">
                  deliver faster
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-chart-1 rounded-full" />
                </span>
                            </h1>

                            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
                                The modern courier platform trusted by 50,000+ businesses. Real-time tracking, instant quotes, and
                                delivery in as fast as 2 hours.
                            </p>

                            <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                {!auth.user ? (
                                    <Link href={route("register")}>
                                        <Button
                                            size="lg"
                                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-base shadow-lg hover:shadow-xl transition-all duration-200"
                                        >
                                            <Package className="mr-2 h-5 w-5" />
                                            Start Shipping
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href={route("shipments.create")}>
                                        <Button
                                            size="lg"
                                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-base shadow-lg hover:shadow-xl transition-all duration-200"
                                        >
                                            <Package className="mr-2 h-5 w-5" />
                                            Create Shipment
                                        </Button>
                                    </Link>
                                )}
                                <Link href={route("tracking.index")}>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="px-8 py-3 text-base border-border hover:bg-accent hover:text-accent-foreground"
                                    >
                                        <Search className="mr-2 h-5 w-5" />
                                        Track Package
                                    </Button>
                                </Link>
                            </div>

                            {/* Quick Tracking */}
                            <div className="mx-auto max-w-md">
                                <Card className="border-border bg-card shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                                <Search className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <h3 className="font-semibold text-card-foreground">Quick Track</h3>
                                        </div>
                                        <form onSubmit={handleTrackingSubmit} className="flex gap-2">
                                            <Input
                                                placeholder="Enter tracking number..."
                                                value={trackingId}
                                                onChange={(e) => setTrackingId(e.target.value)}
                                                className="flex-1 border-input bg-background"
                                            />
                                            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                                <ArrowRight className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="border-y border-border bg-muted/30 py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center group">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-sm group-hover:shadow-md transition-shadow">
                                        <stat.icon className="h-6 w-6 text-primary-foreground" />
                                    </div>
                                    <div className={`mb-1 text-3xl font-bold lg:text-4xl ${stat.accent}`}>{stat.number}</div>
                                    <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 sm:py-32">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <Badge variant="secondary" className="mb-4 bg-muted text-muted-foreground border-border">
                                Features
                            </Badge>
                            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                                Everything you need to ship
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
                                From small packages to enterprise logistics, we've got the tools and network to handle it all.
                            </p>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-3">
                            {features.map((feature, index) => (
                                <Card
                                    key={index}
                                    className="group border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                >
                                    <CardContent className="p-8">
                                        <div
                                            className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.accent} shadow-sm`}
                                        >
                                            <feature.icon className="h-7 w-7 text-white" />
                                        </div>
                                        <h3 className="mb-3 text-xl font-semibold text-card-foreground">{feature.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="bg-muted/30 py-20 sm:py-32">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <Badge variant="secondary" className="mb-4 bg-background text-foreground border-border">
                                Process
                            </Badge>
                            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                                Ship in three simple steps
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
                                Our streamlined process gets your packages moving in minutes, not hours.
                            </p>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-3">
                            {processSteps.map((item, index) => (
                                <div key={index} className="relative">
                                    <div className="text-center">
                                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
                                            <item.icon className="h-8 w-8 text-primary-foreground" />
                                        </div>
                                        <div className="mb-2 text-sm font-bold text-chart-1">{item.step}</div>
                                        <h3 className="mb-4 text-xl font-semibold text-foreground">{item.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                                    </div>
                                    {index < 2 && (
                                        <div className="hidden lg:block absolute top-8 left-full w-full">
                                            <ArrowRight className="h-6 w-6 text-muted-foreground mx-auto" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-20 sm:py-32">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <Badge variant="secondary" className="mb-4 bg-muted text-muted-foreground border-border">
                                Testimonials
                            </Badge>
                            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                                Loved by businesses everywhere
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
                                Join thousands of companies that trust QuickShip for their most important deliveries.
                            </p>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-3">
                            {testimonials.map((testimonial, index) => (
                                <Card key={index} className="border-border bg-card hover:shadow-lg transition-shadow duration-300">
                                    <CardContent className="p-8">
                                        <div className="mb-6 flex">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="h-5 w-5 fill-chart-4 text-chart-4" />
                                            ))}
                                        </div>
                                        <blockquote className="mb-6 text-card-foreground leading-relaxed italic">
                                            "{testimonial.content}"
                                        </blockquote>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-semibold text-sm">
                          {testimonial.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                        </span>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-card-foreground">{testimonial.name}</div>
                                                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                                <div className="text-xs text-muted-foreground">{testimonial.company}</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative overflow-hidden bg-primary py-20 sm:py-32">
                    <div className="absolute inset-0 bg-primary/95" />
                    <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                        <h2 className="mb-6 text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">
                            Ready to transform your shipping?
                        </h2>
                        <p className="mx-auto mb-10 max-w-2xl text-lg text-primary-foreground/80 leading-relaxed">
                            Join over 50,000 businesses that have already made the switch to smarter, faster shipping.
                        </p>
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            {!auth.user ? (
                                <Link href={route("register")}>
                                    <Button size="lg" variant="secondary" className="px-8 py-3 text-base shadow-lg">
                                        <Package className="mr-2 h-5 w-5" />
                                        Start Free Trial
                                    </Button>
                                </Link>
                            ) : (
                                <Link href={route("shipments.create")}>
                                    <Button size="lg" variant="secondary" className="px-8 py-3 text-base shadow-lg">
                                        <Package className="mr-2 h-5 w-5" />
                                        Create Shipment
                                    </Button>
                                </Link>
                            )}
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-3 text-base"
                            >
                                <Phone className="mr-2 h-5 w-5" />
                                Talk to Sales
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="bg-muted/30 py-20 sm:py-32">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-12 lg:grid-cols-2">
                            <div>
                                <Badge variant="secondary" className="mb-4 bg-background text-foreground border-border">
                                    Contact
                                </Badge>
                                <h2 className="mb-6 text-3xl font-bold text-foreground lg:text-4xl">Get in Touch</h2>
                                <p className="mb-8 text-muted-foreground leading-relaxed">
                                    Have questions about our services? Need help with a shipment? Our customer support team is here to
                                    help 24/7.
                                </p>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1">
                                            <Phone className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-foreground">1-800-QUICKSHIP</div>
                                            <div className="text-sm text-muted-foreground">Available 24/7</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2">
                                            <Mail className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-foreground">support@quickship.com</div>
                                            <div className="text-sm text-muted-foreground">We'll respond within 2 hours</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3">
                                            <Clock className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-foreground">24/7 Customer Support</div>
                                            <div className="text-sm text-muted-foreground">Always here when you need us</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Card className="border-border bg-card shadow-lg">
                                <CardContent className="p-8">
                                    <h3 className="mb-6 text-xl font-semibold text-card-foreground">Quick Actions</h3>
                                    <div className="space-y-4">
                                        <Link
                                            href={route("tracking.index")}
                                            className="flex items-center justify-between rounded-xl border border-border p-4 transition-all hover:bg-accent hover:text-accent-foreground group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-1">
                                                    <Search className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="font-medium">Track Your Package</span>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground" />
                                        </Link>
                                        {!auth.user && (
                                            <Link
                                                href={route("register")}
                                                className="flex items-center justify-between rounded-xl border border-border p-4 transition-all hover:bg-accent hover:text-accent-foreground group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-2">
                                                        <Users className="h-4 w-4 text-white" />
                                                    </div>
                                                    <span className="font-medium">Create Account</span>
                                                </div>
                                                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground" />
                                            </Link>
                                        )}
                                        <Link
                                            href={route("support.index")}
                                            className="flex items-center justify-between rounded-xl border border-border p-4 transition-all hover:bg-accent hover:text-accent-foreground group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-3">
                                                    <Shield className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="font-medium">Support Center</span>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground" />
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-primary py-16 text-primary-foreground">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-8 lg:grid-cols-4">
                            <div className="lg:col-span-1">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground">
                                        <AppLogo />
                                    </div>
                                    <span className="text-xl font-bold">QuickShip</span>
                                </div>
                                <p className="text-primary-foreground/80 leading-relaxed mb-6">
                                    The modern courier platform that makes shipping simple, fast, and reliable for businesses of all
                                    sizes.
                                </p>
                                <div className="flex items-center gap-2 text-sm text-primary-foreground/60">
                                    <Award className="h-4 w-4" />
                                    <span>Trusted by 50,000+ businesses</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="mb-4 font-semibold">Services</h4>
                                <ul className="space-y-3 text-primary-foreground/80">
                                    <li className="hover:text-primary-foreground transition-colors cursor-pointer">Same-Day Delivery</li>
                                    <li className="hover:text-primary-foreground transition-colors cursor-pointer">Express Shipping</li>
                                    <li className="hover:text-primary-foreground transition-colors cursor-pointer">International</li>
                                    <li className="hover:text-primary-foreground transition-colors cursor-pointer">
                                        Enterprise Solutions
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="mb-4 font-semibold">Company</h4>
                                <ul className="space-y-3 text-primary-foreground/80">
                                    <li className="hover:text-primary-foreground transition-colors cursor-pointer">About Us</li>
                                    <li className="hover:text-primary-foreground transition-colors cursor-pointer">Careers</li>
                                    <li className="hover:text-primary-foreground transition-colors cursor-pointer">Press Kit</li>
                                    <li className="hover:text-primary-foreground transition-colors cursor-pointer">Contact</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="mb-4 font-semibold">Support</h4>
                                <ul className="space-y-3 text-primary-foreground/80">
                                    <li>
                                        <Link href={route("support.index")} className="hover:text-primary-foreground transition-colors">
                                            Help Center
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={route("tracking.index")} className="hover:text-primary-foreground transition-colors">
                                            Track Package
                                        </Link>
                                    </li>
                                    <li className="hover:text-primary-foreground transition-colors cursor-pointer">API Docs</li>
                                    <li className="hover:text-primary-foreground transition-colors cursor-pointer">Status Page</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-12 border-t border-primary-foreground/20 pt-8">
                            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                                <p className="text-primary-foreground/60">© 2024 QuickShip Courier Service. All rights reserved.</p>
                                <div className="flex gap-6 text-primary-foreground/60">
                                    <span className="hover:text-primary-foreground transition-colors cursor-pointer">Privacy</span>
                                    <span className="hover:text-primary-foreground transition-colors cursor-pointer">Terms</span>
                                    <span className="hover:text-primary-foreground transition-colors cursor-pointer">Cookies</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    )
}
