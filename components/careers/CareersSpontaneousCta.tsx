import Image from "next/image";
import Link from "next/link";

export default function CareersSpontaneousCta() {
  return (
    <aside className="careers-spontaneous">
      <div className="careers-spontaneous-copy">
        <p className="careers-spontaneous-kicker">
          <Image
            src="/images/careers/80cd0.svg"
            alt=""
            width={15}
            height={15}
            unoptimized
          />
          Spontaneous application
        </p>
        <h2>Don&apos;t see your role or is your department filled?</h2>
        <p>
          We are always eager to connect with exceptional neural engineers, kernel optimization
          experts, and technical program managers. Send us your profile directly.
        </p>
      </div>
      <Link
        href="/contact?source=careers&role=General%20Application"
        className="careers-spontaneous-cta"
      >
        Submit a General Application →
      </Link>
    </aside>
  );
}
