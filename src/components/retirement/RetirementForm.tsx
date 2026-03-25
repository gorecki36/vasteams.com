"use client";

import { useState } from "react";
import type { RetirementInputs, Kid } from "@/lib/retirement";

interface RetirementFormProps {
  onSubmit: (inputs: RetirementInputs) => void;
}

let kidCounter = 0;

export default function RetirementForm({ onSubmit }: RetirementFormProps) {
  // Financial Profile
  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(65);
  const [netWorth, setNetWorth] = useState(500_000);
  const [annualSalary, setAnnualSalary] = useState(150_000);
  const [passiveIncome, setPassiveIncome] = useState(0);
  const [costOfLiving, setCostOfLiving] = useState(60_000);
  const [expectedReturn, setExpectedReturn] = useState(6);
  const [inflationRate, setInflationRate] = useState(3);

  // Life Stage
  const [kids, setKids] = useState<Kid[]>([]);
  const [mortgagePaidOff, setMortgagePaidOff] = useState(false);
  const [mortgagePaidOffAge, setMortgagePaidOffAge] = useState(55);
  const [annualMortgage, setAnnualMortgage] = useState(24_000);

  // Life Expectancy
  const [gender, setGender] = useState<"male" | "female">("male");
  const [vo2max, setVo2max] = useState<"elite" | "good" | "average" | "below_average">("average");
  const [bmi, setBmi] = useState<"underweight" | "normal" | "overweight" | "obese">("normal");
  const [smoker, setSmoker] = useState<"yes" | "no" | "former">("no");
  const [familyLongevity, setFamilyLongevity] = useState(false);
  const [chronicConditions, setChronicConditions] = useState<"none" | "one" | "multiple">("none");

  const addKid = () => {
    setKids((prev) => [...prev, { id: `kid-${++kidCounter}`, age: 5 }]);
  };

  const removeKid = (id: string) => {
    setKids((prev) => prev.filter((k) => k.id !== id));
  };

  const updateKidAge = (id: string, age: number) => {
    setKids((prev) => prev.map((k) => (k.id === id ? { ...k, age } : k)));
  };

  const handleSubmit = () => {
    onSubmit({
      currentAge,
      retirementAge,
      netWorth,
      annualSalary,
      passiveIncome,
      costOfLiving,
      expectedReturn: expectedReturn / 100,
      inflationRate: inflationRate / 100,
      kids,
      mortgagePaidOff,
      mortgagePaidOffAge,
      annualMortgage,
      gender,
      vo2max,
      bmi,
      smoker,
      familyLongevity,
      chronicConditions,
    });
  };

  const inputClass =
    "w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm font-mono text-zinc-200 placeholder:text-zinc-700 focus:border-emerald-500/50 focus:outline-none transition-colors";

  const toggleBtn = (active: boolean) =>
    `px-3 py-1.5 text-xs font-mono border transition-colors ${
      active
        ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/5"
        : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
    }`;

  return (
    <section className="space-y-10">
      {/* Section 1: Financial Profile */}
      <div className="space-y-6">
        <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400">
          Financial Profile
        </h2>

        {/* Age sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
              Current age: {currentAge}
            </label>
            <input
              type="range"
              min="18"
              max="75"
              value={currentAge}
              onChange={(e) => {
                const v = Number(e.target.value);
                setCurrentAge(v);
                if (retirementAge <= v) setRetirementAge(v + 1);
              }}
              className="slider w-full"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
              Planned retirement age: {retirementAge}
            </label>
            <input
              type="range"
              min={currentAge + 1}
              max="80"
              value={retirementAge}
              onChange={(e) => setRetirementAge(Number(e.target.value))}
              className="slider w-full"
            />
          </div>
        </div>

        {/* Financial inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-mono text-zinc-600 mb-1">
              Net worth ($)
            </label>
            <input
              type="number"
              value={netWorth || ""}
              onChange={(e) => setNetWorth(Number(e.target.value))}
              placeholder="500000"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-zinc-600 mb-1">
              Annual salary ($)
            </label>
            <input
              type="number"
              value={annualSalary || ""}
              onChange={(e) => setAnnualSalary(Number(e.target.value))}
              placeholder="150000"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-zinc-600 mb-1">
              Passive income ($)
            </label>
            <input
              type="number"
              value={passiveIncome || ""}
              onChange={(e) => setPassiveIncome(Number(e.target.value))}
              placeholder="0"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-zinc-600 mb-1">
              Annual cost of living ($)
            </label>
            <input
              type="number"
              value={costOfLiving || ""}
              onChange={(e) => setCostOfLiving(Number(e.target.value))}
              placeholder="60000"
              className={inputClass}
            />
          </div>
        </div>

        {/* Return & inflation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
              Expected return: {expectedReturn}%
            </label>
            <input
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              className="slider w-full"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
              Inflation rate: {inflationRate}%
            </label>
            <input
              type="range"
              min="0"
              max="8"
              step="0.5"
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
              className="slider w-full"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Life Stage */}
      <div className="space-y-6">
        <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400">
          Life Stage Adjustments
        </h2>

        {/* Kids */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
              Children ({kids.length})
            </label>
            <button
              onClick={addKid}
              className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              + Add child
            </button>
          </div>
          {kids.length > 0 && (
            <div className="space-y-2">
              {kids.map((kid) => (
                <div key={kid.id} className="flex items-center gap-3 border border-zinc-800 p-3">
                  <span className="text-[10px] font-mono text-zinc-600">Age:</span>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={kid.age}
                    onChange={(e) => updateKidAge(kid.id, Number(e.target.value))}
                    className="w-16 bg-zinc-900 border border-zinc-800 px-2 py-1 text-xs font-mono text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                  />
                  <span className="text-[9px] font-mono text-zinc-700 flex-1">
                    College costs at 18-22, independent at 23+
                  </span>
                  <button
                    onClick={() => removeKid(kid.id)}
                    className="text-zinc-600 hover:text-zinc-400 text-xs font-mono"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mortgage */}
        <div className="border border-zinc-800 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
              Mortgage gets paid off?
            </label>
            <button
              onClick={() => setMortgagePaidOff(!mortgagePaidOff)}
              className={toggleBtn(mortgagePaidOff)}
            >
              {mortgagePaidOff ? "Yes" : "No"}
            </button>
          </div>
          {mortgagePaidOff && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-zinc-600 mb-1">
                  Paid off at age: {mortgagePaidOffAge}
                </label>
                <input
                  type="range"
                  min={currentAge}
                  max="80"
                  value={mortgagePaidOffAge}
                  onChange={(e) => setMortgagePaidOffAge(Number(e.target.value))}
                  className="slider w-full"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-zinc-600 mb-1">
                  Annual mortgage cost ($)
                </label>
                <input
                  type="number"
                  value={annualMortgage || ""}
                  onChange={(e) => setAnnualMortgage(Number(e.target.value))}
                  placeholder="24000"
                  className={inputClass}
                />
              </div>
            </div>
          )}
        </div>

        <p className="text-[9px] font-mono text-zinc-700">
          Healthcare auto-adjusts: ~$8k/yr pre-65 (no employer), ~$3k/yr post-65 (Medicare)
        </p>
      </div>

      {/* Section 3: Life Expectancy */}
      <div className="space-y-6">
        <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400">
          Life Expectancy Factors
        </h2>

        {/* Gender */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
            Gender
          </label>
          <div className="flex gap-2">
            {(["male", "female"] as const).map((g) => (
              <button key={g} onClick={() => setGender(g)} className={toggleBtn(gender === g)}>
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* VO2 Max */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
            VO2 Max
          </label>
          <div className="flex flex-wrap gap-2">
            {(["elite", "good", "average", "below_average"] as const).map((v) => (
              <button key={v} onClick={() => setVo2max(v)} className={toggleBtn(vo2max === v)}>
                {v.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* BMI */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
            BMI Range
          </label>
          <div className="flex flex-wrap gap-2">
            {(["underweight", "normal", "overweight", "obese"] as const).map((b) => (
              <button key={b} onClick={() => setBmi(b)} className={toggleBtn(bmi === b)}>
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Smoker */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
            Smoker
          </label>
          <div className="flex gap-2">
            {(["no", "former", "yes"] as const).map((s) => (
              <button key={s} onClick={() => setSmoker(s)} className={toggleBtn(smoker === s)}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Family longevity */}
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
            Parents lived past 85?
          </label>
          <button
            onClick={() => setFamilyLongevity(!familyLongevity)}
            className={toggleBtn(familyLongevity)}
          >
            {familyLongevity ? "Yes" : "No"}
          </button>
        </div>

        {/* Chronic conditions */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
            Chronic conditions
          </label>
          <div className="flex gap-2">
            {(["none", "one", "multiple"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setChronicConditions(c)}
                className={toggleBtn(chronicConditions === c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full py-3 text-sm font-mono uppercase tracking-widest border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 cursor-pointer transition-all"
      >
        Calculate Retirement
      </button>
    </section>
  );
}
