import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { useLanguage, useTheme } from "~/contexts";
import { returns } from "~/server/ssr";
import { User } from "~/types";

type Props = {
  user: User;
};

export default function AboutUs({ user }: Props) {
  const { lang } = useLanguage();
  const { theme } = useTheme();

  return (
    <div
      className={twMerge(
        "min-h-screen flex flex-col px-8 md:px-12 lg:px-16 2xl:px-32 py-4 lg:py-5",
        theme === "dark"
          ? "bg-neutral-900 text-white"
          : "bg-white text-neutral-900"
      )}
    >
      <div className="flex justify-between items-center">
        <h1 className="font-medium text-lg lg:text-xl">
          {lang === "en" ? (
            <>
              About <strong>Onus</strong>
            </>
          ) : (
            <>
              <strong>온어스</strong>에 대해
            </>
          )}
        </h1>
        <Link
          href={"/"}
          className={twMerge(
            "px-4 py-2 rounded border   font-medium text-sm ",
            theme === "dark"
              ? "border-white bg-white text-neutral-900 lg:hover:bg-neutral-900 lg:hover:text-white"
              : "border-neutral-900 bg-neutral-900 text-white lg:hover:bg-white lg:hover:text-neutral-900"
          )}
        >
          {user
            ? lang === "en"
              ? "Go to dashboard"
              : "알림판으로 가기"
            : lang === "en"
            ? "Login"
            : "로그인 하기"}
        </Link>
      </div>
      <div className="mt-6 mg:mt-8 lg:mt-10 flex flex-col gap-y-8 lg:gap-y-10">
        <div>
          <h2 className="mb-6 text-2xl lg:text-3xl">
            {lang === "en" ? (
              <>
                Group & Prayer <strong>Features</strong>
              </>
            ) : (
              <>
                그룹 및 기도제목 <strong>기능</strong>
              </>
            )}
          </h2>

          <ul className="flex flex-col gap-y-4 px-8 opacity-75">
            <p>
              {lang === "en"
                ? "You can create a prayer group & post your prayers to share with the members."
                : "기도 그룹을 만들고 멤버들과 공유할 기도제목을 올릴 수 있어요."}
            </p>
            <p>
              {lang === "en"
                ? "You can invite a member via their email in the group detail page."
                : "그룹 페이지 에서 이메일을 통해 멤버를 초대 할 수 있어요."}
            </p>
            <p>
              {lang === "en"
                ? "You can invite a member via their email in the group detail page."
                : "그룹 페이지 에서 이메일을 통해 멤버를 초대 할 수 있어요."}
            </p>
            <p>
              {lang === "en"
                ? "If you are the creator of the group, you can edit or delete the group anytime."
                : "기도 그룹을 만든 유저는 언제든 그룹을 수정하시고 삭제하실 수 있습니다."}
            </p>
            <p>
              {lang === "en"
                ? "If you are one of the members of a group, you can create prayer to share."
                : "기도 그룹의 멤버인 유저는 그 그룹 안에서 기도제목을 만드실 수 있습니다."}
            </p>
            <p>
              {lang === "en"
                ? "You can edit or delete the prayer you create in your group."
                : "올리셨던 기도제목들은 언제든 수정하시거나 삭제하실 수 있습니다."}
            </p>
          </ul>
        </div>
        <div>
          <h2 className="mb-6 text-2xl lg:text-3xl">
            {lang === "en" ? (
              <>
                User Personal <strong>Features</strong>
              </>
            ) : (
              <>
                유저 개인 <strong>기능</strong>
              </>
            )}
          </h2>

          <ul className="flex flex-col gap-y-4 px-8 opacity-75">
            <p>
              {lang === "en"
                ? "Edit your personal profile and preferences"
                : "프로필 및 환경설정을 항시 수정 가능."}
            </p>
            <p>
              {lang === "en"
                ? "You can accept or decline any incoming invitations."
                : "들어오는 모든 초대장에 수락 또는 거절을 할 수 있어요."}
            </p>
          </ul>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props } = returns();
  const user = (await getSession(ctx)) as unknown as User;
  return props({ user: user ? user : null });
};
