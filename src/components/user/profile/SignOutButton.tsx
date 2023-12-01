import { signOut } from "next-auth/react";

const SignOutButton: React.FC = () => {
  return (
    <button
      type="button"
      onClick={() => {
        signOut();
      }}
      className="font-medium px-3 py-0.5 text-red-500 lg:hover:text-red-400"
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
