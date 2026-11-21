"use client";
import { useHydrated } from "@/lib/useHydrated";
import { useRouter } from "next/navigation";
export default function ExamplePicker({ id, samples }: { id: string; samples: { id: string; title: string }[] }) {
    const ready = useHydrated();
    const router = useRouter();
    return (
        <div className="filters">
            <label>
                Example
                <select
                    disabled={!ready}
                    aria-label="Example"
                    value={id}
                    onChange={(e) =>
                        router.push("/play?example=" + e.target.value)
                    }
                >
                    {samples.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.title}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
}
