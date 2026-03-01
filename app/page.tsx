import { slotsEngine } from "@/lib/games";
import SlotsEngine from "@/components/slots-engine/SlotsEngine";

export async function generateMetadata() {
    return {
        title: slotsEngine.title,
        description: slotsEngine.description,
    };
}

export default function SlotsEnginePage() {
    return (
        <div className="w-full max-w-6xl mx-auto">
            <div className="flex flex-row mb-2 sm:mb-4">
                <h1 className="text-3xl font-semibold mr-2">
                    {slotsEngine.title}
                </h1>
            </div>
            <SlotsEngine game={slotsEngine} />
        </div>
    );
}
