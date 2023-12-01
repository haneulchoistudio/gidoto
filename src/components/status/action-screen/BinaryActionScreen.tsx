import { HiArrowRight } from "react-icons/hi";

interface BinaryActionScreenProps {
  title: string;
  description: string;
  action: {
    positive: {
      name: string;
      onClick: () => void;
    };
    negative: {
      name: string;
      onClick: () => void;
    };
  };
}

const BinaryActionScreen: React.FC<BinaryActionScreenProps> = ({
  title,
  description,
  action,
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
        <button
          onClick={action.positive.onClick}
          type="button"
          className="w-full flex items-center justify-between gap-x-3.5 lg:gap-x-5 font-medium text-neutral-600 border rounded lg:hover:border-neutral-900 lg:hover:text-neutral-900 px-6 py-3 lg:px-8 lg:py-3.5"
        >
          <span>{action.positive.name}</span>
          <HiArrowRight />
        </button>
        <button
          onClick={action.negative.onClick}
          type="button"
          className="w-full flex items-center justify-between gap-x-3.5 lg:gap-x-5 font-medium text-neutral-600 border rounded lg:hover:border-neutral-900 lg:hover:text-neutral-900 px-6 py-3 lg:px-8 lg:py-3.5"
        >
          <span>{action.negative.name}</span>
          <HiArrowRight />
        </button>
      </ul>
    </div>
  );
};

export default BinaryActionScreen;
