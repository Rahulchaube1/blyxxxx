"use client";
import { useRouter } from "next/navigation";
import samples from "@/lib/samples.json";
export default function ExamplePicker({ id }: { id: string }) {
    const router = useRouter();
    return (
        <div className="filters">
            <label>
                Example
                <select
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
