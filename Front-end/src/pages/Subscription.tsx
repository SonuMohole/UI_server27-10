"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, Zap, Crown, Rocket } from "lucide-react";
import { toast } from "sonner";

const plans = [
  {
    name: "Free Tier",
    icon: Zap,
    gradient: "from-gray-50 via-white to-gray-100",
    accent: "text-blue-600",
    border: "border-gray-200",
    price: { monthly: 0, annual: 0 },
    features: [
      "Up to 3 agents",
      "Basic vulnerability scanning",
      "Limited KEV data (recent 10 only)",
      "Community support",
      "7-day report retention",
    ],
    limitations: ["No advanced reports", "No AI insights", "No priority scans"],
    current: false,
  },
  {
    name: "Pro Tier",
    icon: Crown,
    gradient: "from-green-50 via-white to-green-100",
    accent: "text-maroon-700",
    border: "border-green-300",
    price: { monthly: 99, annual: 950 },
    features: [
      "Up to 50 agents",
      "Advanced vulnerability scanning",
      "Full KEV archive access",
      "Priority support (24/7)",
      "Unlimited report retention",
      "AI-powered insights",
      "Custom scan scheduling",
      "API access",
    ],
    current: true,
    popular: true,
  },
  {
    name: "Enterprise Tier",
    icon: Rocket,
    gradient: "from-indigo-50 via-white to-violet-100",
    accent: "text-purple-700",
    border: "border-purple-300",
    price: { monthly: 499, annual: 4790 },
    features: [
      "Unlimited agents",
      "Enterprise-grade scanning",
      "Custom intelligence feeds",
      "Dedicated account manager",
      "AI Assistant (GPT-5)",
      "White-label branding",
      "SLA 99.9% uptime",
      "On-prem deployment",
    ],
    current: false,
  },
];

export default function Subscription() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const handlePurchase = (planName: string, price: number) => {
    if (price === 0) {
      toast.info("You're already on the Free plan");
      return;
    }
    toast.success(`Processing payment for ${planName} (${billingCycle})...`, {
      description: "Secure payment confirmation required",
    });
  };

  return (
    <div className="p-10 bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-900 min-h-screen space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-maroon-800">
          Choose Your Plan
        </h1>
        <p className="text-gray-600 max-w-lg mx-auto">
          Find the perfect fit for your team’s cybersecurity needs.
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-3 border rounded-full px-5 py-2 bg-white shadow-md">
          <span
            className={`${
              billingCycle === "monthly" ? "font-semibold text-maroon-700" : "text-gray-400"
            }`}
          >
            Monthly
          </span>
          <Switch
            checked={billingCycle === "annual"}
            onCheckedChange={(checked) => setBillingCycle(checked ? "annual" : "monthly")}
          />
          <span
            className={`${
              billingCycle === "annual" ? "font-semibold text-maroon-700" : "text-gray-400"
            }`}
          >
            Annual
          </span>
          {billingCycle === "annual" && (
            <Badge className="ml-2 bg-green-100 text-green-700 border border-green-200">
              Save 20%
            </Badge>
          )}
        </div>
      </div>

      {/* Current Plan Banner */}
      {/* <Card className="p-4 border-l-4 border-l-maroon-700 bg-white shadow-lg max-w-3xl mx-auto rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Current Plan</p>
            <h3 className="text-2xl font-bold text-maroon-700">Pro Tier</h3>
          </div>
          <Badge className="bg-green-100 text-green-700 border border-green-200">Active</Badge>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Renews on <span className="font-medium text-maroon-700">October 15, 2025</span>
        </p>
      </Card> */}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const price = plan.price[billingCycle];
          const savings =
            billingCycle === "annual"
              ? ((plan.price.monthly * 12) - plan.price.annual).toFixed(0)
              : 0;

          return (
            <Card
              key={plan.name}
              className={`relative rounded-2xl overflow-hidden border ${plan.border} 
              bg-gradient-to-br ${plan.gradient} 
              shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]`}
            >
              {/* Popular & Active Tags */}
              <div className="absolute top-4 left-4 flex gap-2">
                {plan.popular && (
                  <Badge className="bg-maroon-100 text-maroon-800 border border-maroon-200">
                    Popular
                  </Badge>
                )}
                {plan.current && (
                  <Badge className="bg-green-100 text-green-700 border border-green-200">
                    Active
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="text-center pt-10 pb-4 px-6">
                <div className={`inline-flex p-4 rounded-xl bg-white shadow-sm mb-4 ${plan.accent}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-semibold">{plan.name}</h3>
                <p className="mt-1 text-3xl font-bold text-maroon-700">
                  ${price}
                  <span className="text-sm font-normal text-gray-500">
                    /{billingCycle === "monthly" ? "mo" : "yr"}
                  </span>
                </p>
                {billingCycle === "annual" && price > 0 && (
                  <p className="text-xs text-green-600 mt-1">Save ${savings}/year</p>
                )}
              </div>

              {/* Features */}
              <ul className="px-8 mt-3 space-y-2 text-sm text-gray-700">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.limitations?.map((limit, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-400 line-through">
                    ✗ {limit}
                  </li>
                ))}
              </ul>

              {/* Button */}
              <div className="p-6 text-center">
                <Button
                  onClick={() => handlePurchase(plan.name, price)}
                  className={`w-full rounded-xl font-semibold transition-all ${
                    plan.current
                      ? "bg-green-600 hover:bg-green-700"
                      : plan.popular
                      ? "bg-gradient-to-r from-maroon-600 via-rose-500 to-maroon-700 text-white hover:opacity-90"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                  disabled={plan.current}
                >
                  {plan.current ? "Current Plan" : price === 0 ? "Get Started" : "Upgrade"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Footer Info */}
      <Card className="p-8 border-t-4 border-t-maroon-700 bg-gray-50 mt-10 shadow-md rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-2xl mb-1">🔒</p>
            <h4 className="font-semibold text-maroon-800">Secure Payments</h4>
            <p className="text-xs text-gray-500">256-bit SSL encryption</p>
          </div>
          <div>
            <p className="text-2xl mb-1">🔄</p>
            <h4 className="font-semibold text-maroon-800">Flexible Billing</h4>
            <p className="text-xs text-gray-500">Cancel anytime, no hidden fees</p>
          </div>
          <div>
            <p className="text-2xl mb-1">💬</p>
            <h4 className="font-semibold text-maroon-800">24/7 Support</h4>
            <p className="text-xs text-gray-500">Expert help anytime</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
