"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { PRICING_PLANS } from "../_component/PricingPlan";
import {
  CheckCircle2,
  Crown,
  Sparkles,
  Zap,
  ArrowRight,
  CreditCard,
  Lock,
  Rocket,
  BellRing,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function UpgradePage() {
  const { user } = useUser();
  const [billingCycle, setBillingCycle] = useState("monthly"); // "monthly" | "yearly"
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleSelectPlan = (plan) => {
    if (plan.id === "free") return;
    setSelectedPlan(plan);
    setShowComingSoon(false);
    setCheckoutModalOpen(true);
  };

  const handleProceedToPayment = () => {
    setShowComingSoon(true);
    toast.info("Payment gateway is coming soon! Thank you for your interest.");
  };

  const handleNotifyMe = () => {
    toast.success("🎉 You're on the priority waitlist! We'll notify you as soon as payment is live.");
    setCheckoutModalOpen(false);
  };

  return (
    <div className="py-8 space-y-12 max-w-6xl mx-auto px-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/80 px-3 py-1 text-xs font-semibold text-blue-700">
          <Crown className="h-3.5 w-3.5" /> Flexible & Transparent Pricing
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          Accelerate Your Career with Unlimited AI Prep
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Start with 6 free sessions across Technical Interviews, Coding Rounds, and Resume Analyses. Upgrade anytime for unlimited practice.
        </p>

        {/* Monthly vs Yearly Billing Switch */}
        <div className="inline-flex items-center bg-secondary/80 p-1.5 rounded-2xl border border-border/80 shadow-2xs mt-4">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              billingCycle === "monthly"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              billingCycle === "yearly"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Annual Billing</span>
            <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 font-bold">
              Save 30%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {PRICING_PLANS.map((plan) => {
          const isYearly = billingCycle === "yearly";
          const displayPrice =
            plan.id === "free"
              ? "$0"
              : isYearly && plan.id === "pro-yearly"
              ? "$99"
              : isYearly && plan.id === "pro-monthly"
              ? "$12"
              : `$${plan.monthlyPrice}`;

          const displaySubtext =
            plan.id === "free"
              ? "Free forever"
              : isYearly && plan.id === "pro-yearly"
              ? "billed annually ($8.25/mo)"
              : "billed monthly";

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between rounded-3xl p-6 md:p-8 transition-all duration-300 ${
                plan.popular
                  ? "border-2 border-blue-600 bg-gradient-to-b from-blue-50/40 via-card to-card shadow-xl shadow-blue-500/10 -translate-y-1"
                  : "border border-border/80 bg-card hover:border-blue-300/80 hover:shadow-md"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-1 text-[11px] font-bold text-white shadow-md">
                  Most Popular • Best Value
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-foreground">
                    {plan.name}
                  </h3>
                  {plan.popular && (
                    <Sparkles className="h-5 w-5 text-blue-600 animate-pulse" />
                  )}
                </div>

                <p className="text-xs text-muted-foreground min-h-[36px]">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="my-6 border-y border-border/60 py-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight text-foreground">
                      {displayPrice}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      / {plan.id === "free" ? "starter" : isYearly && plan.id === "pro-yearly" ? "year" : "month"}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground block mt-1">
                    {displaySubtext}
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    What's included:
                  </span>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-foreground/90"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4">
                {plan.id === "free" ? (
                  <Button
                    variant="outline"
                    disabled
                    className="w-full text-xs font-semibold rounded-xl h-10"
                  >
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full text-xs font-semibold rounded-xl h-10 gap-1.5 cursor-pointer shadow-sm ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    <span>{plan.buttonText}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Free Plan Token Limit Policy Banner */}
      <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-r from-blue-50/70 to-indigo-50/40 p-6 text-xs text-foreground/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground">
              How Free Token Limits Work
            </h4>
            <p className="mt-1 text-muted-foreground max-w-2xl leading-relaxed">
              Every free user gets <strong>6 total free AI sessions</strong> (2 Technical Mock Interviews, 2 Coding Assessments, and 2 Resume ATS Analyses). Once exhausted, you can upgrade to a monthly or yearly plan for unlimited AI evaluations.
            </p>
          </div>
        </div>
      </div>

      {/* Plan Checkout & Coming Soon Modal */}
      <Dialog
        open={checkoutModalOpen}
        onOpenChange={(open) => {
          setCheckoutModalOpen(open);
          if (!open) setShowComingSoon(false);
        }}
      >
        <DialogContent className="sm:max-w-[460px] p-6 border-blue-200/80 bg-gradient-to-b from-card via-card to-blue-50/20 shadow-2xl">
          {showComingSoon ? (
            /* Coming Soon State */
            <div className="text-center space-y-4 py-2 animate-in fade-in zoom-in-95 duration-200">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-blue-500/25">
                <Rocket className="h-8 w-8 animate-bounce" />
              </div>

              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-0.5 text-xs font-bold text-amber-800 border border-amber-300/80">
                  <Sparkles className="h-3 w-3" /> Coming Soon
                </span>
                <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                  Payment Gateway Coming Soon!
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  We are currently integrating automated payment gateways (Stripe & Razorpay) for the{" "}
                  <strong className="text-foreground">{selectedPlan?.name}</strong> plan.
                </DialogDescription>
              </div>

              {/* Status & Reassurance Card */}
              <div className="rounded-2xl border border-blue-200/80 bg-blue-50/70 p-4 text-xs text-left space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-blue-900">
                  <Zap className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Free Quotas Remain Active</span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-[11px]">
                  All user accounts have <strong>6 total free AI sessions</strong> (2 Technical Interviews, 2 Coding Rounds, and 2 Resume ATS Analyses). You can continue practicing while we finalize the payment system.
                </p>
                <div className="pt-1 border-t border-blue-200/60 flex items-center justify-between text-[11px] font-medium text-blue-700">
                  <span>Selected: {selectedPlan?.name}</span>
                  <span className="font-bold">
                    {billingCycle === "yearly" && selectedPlan?.id === "pro-yearly"
                      ? "$99.00 / year"
                      : `$${selectedPlan?.monthlyPrice}.00 / month`}
                  </span>
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCheckoutModalOpen(false)}
                  className="w-full sm:w-auto text-xs cursor-pointer rounded-xl"
                >
                  Close
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleNotifyMe}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs gap-1.5 font-semibold cursor-pointer rounded-xl shadow-md shadow-blue-500/20"
                >
                  <BellRing className="h-3.5 w-3.5" />
                  <span>Notify Me When Live</span>
                </Button>
              </DialogFooter>
            </div>
          ) : (
            /* Plan Review & Click for Payment */
            <div className="space-y-4 pt-1">
              <DialogHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-2">
                  <CreditCard className="h-6 w-6" />
                </div>
                <DialogTitle className="text-center text-lg font-bold">
                  Upgrade to {selectedPlan?.name}
                </DialogTitle>
                <DialogDescription className="text-center text-xs text-muted-foreground">
                  Confirm your subscription details and proceed to payment.
                </DialogDescription>
              </DialogHeader>

              {/* Plan Summary Card */}
              <div className="rounded-2xl bg-secondary/60 p-4 border border-border/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-foreground block">
                      {selectedPlan?.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {billingCycle === "yearly" ? "Billed Annually (Save 30%)" : "Billed Monthly"}
                    </span>
                  </div>
                  <span className="text-lg font-extrabold text-blue-600">
                    {billingCycle === "yearly" && selectedPlan?.id === "pro-yearly"
                      ? "$99.00"
                      : `$${selectedPlan?.monthlyPrice}.00`}
                  </span>
                </div>

                <div className="border-t border-border/60 pt-2.5 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Included with upgrade:
                  </span>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-2 text-[11px] text-foreground/90">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Unlimited Technical Mock Interviews</span>
                    </li>
                    <li className="flex items-center gap-2 text-[11px] text-foreground/90">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Unlimited Monaco Algorithmic Coding Rounds</span>
                    </li>
                    <li className="flex items-center gap-2 text-[11px] text-foreground/90">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Unlimited ATS Resume Analyses & Scoring</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Payment Methods Notice */}
              <div className="rounded-xl border border-border/80 bg-muted/40 p-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-foreground">
                    Supported Payment Methods
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                    Stripe • Razorpay
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Lock className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span>256-bit encrypted secure payment pipeline</span>
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCheckoutModalOpen(false)}
                  className="w-full sm:w-auto text-xs cursor-pointer rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleProceedToPayment}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs gap-1.5 font-semibold cursor-pointer rounded-xl shadow-md shadow-blue-500/20"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
