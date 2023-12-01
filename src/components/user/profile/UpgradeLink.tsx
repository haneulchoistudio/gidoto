import Link from "next/link";
import { FiHash } from "react-icons/fi";

const UpgradeLink: React.FC = () => {
  return (
    <Link
      href={"/account/subscription/plan"}
      className="text-base lg:text-lg px-3 py-2 rounded-full flex items-center justify-between w-full text-emerald-500 lg:hover:text-emerald-700 font-medium"
    >
      <span>Upgrade</span>
      <FiHash />
    </Link>
  );
};

export default UpgradeLink;
