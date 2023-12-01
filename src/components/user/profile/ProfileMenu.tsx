import Link from "next/link";
import UpgradeLink from "./UpgradeLink";
import SignOutButton from "./SignOutButton";

interface ProfileMenuProps {
  isOnFreePlan: boolean;
}

interface LinkProps {
  href: string;
  label: string;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ isOnFreePlan }) => {
  const profileMenuLinks: LinkProps[] = [
    { href: "/account/profile", label: "Profile" },
  ];

  return (
    <aside className="px-2 py-3 rounded border shadow-xl absolute z-10 top-12 bg-white right-0">
      <ul className="flex flex-col items-start w-max">
        {isOnFreePlan && <UpgradeLink />}
        {profileMenuLinks.map((link, idx) => (
          <Link
            key={idx}
            href={link.href}
            className="px-3 py-0.5 text-neutral-600 lg:hover:text-neutral-400"
          >
            {link.label}
          </Link>
        ))}
        <SignOutButton />
      </ul>
    </aside>
  );
};

export default ProfileMenu;
