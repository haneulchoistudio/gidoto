import { useState } from "react";
import Profile from "./Profile";
import ProfileMenu from "./ProfileMenu";
import { useLanguage, useTheme } from "~/contexts";

interface ProfileButtonProps {
  image: string;
  isOnFreePlan: boolean;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({
  image,
  isOnFreePlan,
}) => {
  const d_language = useLanguage();
  const d_theme = useTheme();

  const [openMenu, setOpenMenu] = useState<boolean>(false);

  return (
    <div className="relative z-20 flex items-center gap-x-2.5">
      <span className="bg-neutral-50 cursor-pointer lg:hover:bg-neutral-900 transition-all duration-[0.35s] ease-in-out border px-2.5 py-1 rounded-full">
        <span className="font-medium uppercase tracking-[0.075rem] text-xs lg:text-sm text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-400 to-blue-400">
          {d_language.lang === "en" ? "Beta" : "베타버젼"}
        </span>
      </span>
      <button type="button" onClick={() => setOpenMenu(!openMenu)}>
        <Profile image={image} asModal={openMenu} />
      </button>
      {openMenu && <ProfileMenu isOnFreePlan={isOnFreePlan} />}
    </div>
  );
};

export default ProfileButton;
