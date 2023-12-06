import Link from "next/link";
import UpgradeLink from "./UpgradeLink";
import SignOutButton from "./SignOutButton";
import { useRouter } from "next/router";
import { useLanguage, useTheme } from "~/contexts";

interface ProfileMenuProps {
  isOnFreePlan: boolean;
}

interface LinkProps {
  href: string;
  label: string;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ isOnFreePlan }) => {
  const d_language = useLanguage();
  const d_theme = useTheme();
  const router = useRouter();

  const profileMenuLinks: LinkProps[] = [
    {
      href: "/dashboard",
      label: d_language.lang === "en" ? "Dashboard" : "온어스 알림판",
    },
    {
      href: "/account/profile",
      label: d_language.lang === "en" ? "Profile" : "프로필 설정",
    },
    {
      href: "/account/preferences",
      label: d_language.lang === "en" ? "Preferences" : "환경 설정",
    },
  ];

  return (
    <aside className="px-2 py-3 rounded border shadow-xl absolute z-10 top-12 bg-white right-0">
      <ul className="flex flex-col items-start w-max">
        {/* {isOnFreePlan && <UpgradeLink />} */}
        {profileMenuLinks.map(
          (link, idx) =>
            router.pathname !== link.href && (
              <Link
                key={idx}
                href={link.href}
                className="px-3 py-0.5 text-neutral-600 lg:hover:text-neutral-400"
              >
                {link.label}
              </Link>
            )
        )}
        <SignOutButton />
      </ul>
    </aside>
  );
};

export default ProfileMenu;
