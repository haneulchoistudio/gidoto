import { SiInstagram, SiKakaotalk } from "react-icons/si";
import { $ } from "~/client/utils";
import { useLanguage, useTheme } from "~/contexts";

interface GroupDetailAccountsProps {
  instagram: string;
  kakaotalk: string;
}

const GroupDetailAccounts: React.FC<GroupDetailAccountsProps> = ({
  instagram,
  kakaotalk,
}) => {
  const { lang, switchLanguage } = useLanguage();
  const { theme: _, switchTheme } = useTheme();
  const $data = $("pages", "groupDetail");
  return (
    <div className="flex flex-col items-center gap-3.5 lg:gap-5">
      <div className="flex items-center justify-between gap-x-4 w-full">
        <h2 className="font-medium text-xl lg:text-2xl">
          {$data.titles.containers.accounts[lang]}
        </h2>
      </div>
      <ul className="flex items-center justify-start gap-x-2.5 w-full">
        {instagram && (
          <a
            href={instagram}
            target="_blank"
            referrerPolicy="no-referrer"
            className="w-[32.5px] h-[32.5px] rounded flex justify-center items-center border bg-neutral-50 lg:hover:bg-neutral-900 lg:hover:border-neutral-900 lg:hover:text-white"
          >
            <SiInstagram />
          </a>
        )}
        {kakaotalk && (
          <a
            href={kakaotalk}
            target="_blank"
            referrerPolicy="no-referrer"
            className="w-[32.5px] h-[32.5px] rounded flex justify-center items-center border bg-neutral-50 lg:hover:bg-neutral-900 lg:hover:border-neutral-900 lg:hover:text-white"
          >
            <SiKakaotalk />
          </a>
        )}
      </ul>
    </div>
  );
};

export default GroupDetailAccounts;
