import Link from "next/link";
import {
  HiArrowCircleDown,
  HiArrowCircleRight,
  HiArrowRight,
} from "react-icons/hi";

type RedirectUrl = {
  href: string;
  name: string;
};

interface AccessErrorScreenProps {
  title: string;
  description: string;

  redirectUrls: RedirectUrl[];
}

const AccessErrorScreen: React.FC<AccessErrorScreenProps> = ({
  title,
  description,
  redirectUrls,
}) => {
  return (
    <div className="h-screen flex flex-col justify-center items-center px-8 md:px-12 lg:px-32">
      <article className="flex flex-col items-center text-center gap-y-2.5 mb-5 lg:mb-6">
        <h2 className="font-medium text-xl lg:text-2xl">
          <span className="text-red-500">*</span>
          {title}
        </h2>
        <p className="text-neutral-600 px-4 lg:text-lg leading-[1.67]">
          {description}
        </p>
      </article>
      <ul className="w-max mx-auto flex flex-col items-center gap-y-5">
        {redirectUrls.map((redirect, idx) => (
          <Link
            href={redirect.href}
            key={idx}
            className="w-full flex items-center justify-between gap-x-3.5 lg:gap-x-5 font-medium text-neutral-600 border rounded lg:hover:border-neutral-900 lg:hover:text-neutral-900 px-6 py-3 lg:px-8 lg:py-3.5"
          >
            <span> {redirect.name}</span>
            <HiArrowRight />
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default AccessErrorScreen;
