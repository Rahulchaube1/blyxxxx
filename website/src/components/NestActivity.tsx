import { nestRegistry } from "@/lib/site";

export default function NestActivity() {
    return (
        <section className="block" aria-label="Blyx Nest activity">
            <div className="section-head">
                <h2>Blyx Nest activity</h2>
                <a href={nestRegistry + "/stats.html"}>Registry statistics</a>
            </div>
            <iframe className="nest-activity-strip" src="/nest/activity.html"
                title="Package projects, releases, files and active playground browsers" />
        </section>
    );
}
