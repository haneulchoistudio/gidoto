import { FiMail, FiPhone, FiVoicemail } from "react-icons/fi";

interface GroupDetailContactLeaderProps {
  name: string;
  email: string;
  phone: string;
}

const GroupDetailContactLeader: React.FC<GroupDetailContactLeaderProps> = ({
  email,
  name,
  phone,
}) => {
  return (
    <div className="flex flex-col items-center gap-3.5 lg:gap-5">
      <div className="flex items-center justify-between gap-x-4 w-full">
        <h2 className="font-medium text-xl lg:text-2xl">Contact the Leader</h2>
      </div>
      <ul className="flex flex-col w-full">
        {name && (
          <p className="text-lg lg:text-xl text-neutral-600 mb-1">{name}</p>
        )}
        {email && (
          <p className="font-light text-base text-neutral-400 flex items-center gap-x-1.5 mb-0.5">
            <FiMail />
            <span> {email}</span>
          </p>
        )}
        {phone && (
          <p className="font-light text-base text-neutral-400 flex items-center gap-x-1.5">
            <FiPhone />
            <span> {phone}</span>
          </p>
        )}
      </ul>
    </div>
  );
};

export default GroupDetailContactLeader;
