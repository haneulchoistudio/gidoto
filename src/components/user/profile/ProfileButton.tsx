import { useState } from "react";
import Profile from "./Profile";
import ProfileMenu from "./ProfileMenu";

interface ProfileButtonProps {
  image: string;
  isOnFreePlan: boolean;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({
  image,
  isOnFreePlan,
}) => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  return (
    <div className="relative z-20 flex items-center">
      <button type="button" onClick={() => setOpenMenu(!openMenu)}>
        <Profile image={image} asModal={openMenu} />
      </button>
      {openMenu && <ProfileMenu isOnFreePlan={isOnFreePlan} />}
    </div>
  );
};

export default ProfileButton;
