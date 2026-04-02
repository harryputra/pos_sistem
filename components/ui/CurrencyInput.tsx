"use client";
import { useState, useEffect, InputHTMLAttributes } from "react";
import { formatNumber, parseCurrency } from "@/lib/utils";

interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
    value: number;
    onChange: (value: number) => void;
}

export default function CurrencyInput({ value, onChange, ...props }: CurrencyInputProps) {
    const [displayValue, setDisplayValue] = useState("");

    useEffect(() => {
        // Update display when value changes from outside
        if (value === 0 && displayValue === "") return;
        const formatted = value ? formatNumber(value) : "";
        if (formatted !== displayValue) {
            setDisplayValue(formatted);
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const numeric = parseCurrency(raw);

        if (isNaN(numeric)) {
            setDisplayValue("");
            onChange(0);
            return;
        }

        setDisplayValue(formatNumber(numeric));
        onChange(numeric);
    };

    return (
        <input
            {...props}
            type="text"
            value={displayValue}
            onChange={handleChange}
            placeholder={props.placeholder || "0"}
        />
    );
}
