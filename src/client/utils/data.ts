import type { LanguageOptions } from "~/contexts/Language";

type LanguageDependentData<T> = Record<LanguageOptions, T>;

const name = {
  en: "Gidoto",
  ko: "기도터",
};

const titles = {
  dashboard: {
    en: "Dashboard",
    ko: `${name} 알림판`,
  },
  createGroup: {
    en: "Create Group",
    ko: "",
  },
  createGroupPrayer: {
    en: "Create Prayer",
    ko: "",
  },
  accountProfile: {
    en: "Profile",
    ko: "",
  },
  accountPreferences: {
    en: "Preferences",
    ko: "",
  },
} satisfies Record<string, LanguageDependentData<string>>;

function $<Key extends string[]>(...key: Key) {
  const data = {
    pages: {
      dashboard: {
        titles: {
          head: {
            en: "Dashboard",
            ko: `기도터 알림판`,
          },
          containers: {
            groupList: {
              en: "List of Groups",
              ko: "그룹 리스트",
            },
            inviteList: {
              en: "Incoming Invites",
              ko: "초대장 리스트",
            },
          },
        },
        buttons: {
          newGroup: {
            en: "New Group",
            ko: "새 그룹",
          },
          searchGroup: {
            en: "Search",
            ko: "검색",
          },
          edit: {
            en: "Edit",
            ko: "수정",
          },
          delete: {
            en: "Delete",
            ko: "삭제",
          },
        },
        paragraphs: {
          noGroup: {
            en: "You do not have a group yet.",
            ko: "아직 참여하시는 그룹이 없습니다.",
          },
          noInvite: {
            en: "You do not have an invitation.",
            ko: "지금은 그룹 초대장이 없습니다.",
          },
        },
      },
      accountProfile: {
        titles: { head: { en: "Account Profile", ko: "계정 프로필" } },
        labels: {
          name: {
            en: "Your name",
            ko: "이름",
          },
          nickname: {
            en: "Your nickname",
            ko: "닉네임",
          },
          email: {
            en: "Your email",
            ko: "이메일",
          },
          bio: {
            en: "About yourself",
            ko: "자기 소개 글",
          },
        },
        buttons: {
          submit: {
            en: "Update Profile",
            ko: "프로필 수정하기",
          },
        },
      },
      accountPreferences: {
        titles: { head: { en: "Account Preferences", ko: "계정 환경설정" } },
        labels: {
          lang: {
            en: "Set language",
            ko: "언어 설정",
          },
          theme: {
            en: "Set theme",
            ko: "테마 설정",
          },
          profileAccess: {
            en: "Profile access",
            ko: "프로필 공개",
          },
          publicNicknameAccess: {
            en: "Public nickname access",
            ko: "닉네임 공개",
          },
        },
        buttons: {
          submit: {
            en: "Update Preferences",
            ko: "환경설정 수정하기",
          },
        },
      },
      createGroup: {
        titles: {
          head: {
            en: "Create new group",
            ko: `새로운 그룹`,
          },
        },
        labels: {
          theme: {
            en: "Set your group's theme.",
            ko: "그룹 테마를 정해주세요.",
          },
          name: {
            en: "Set your group's name.",
            ko: "그룹 이름을 정해주세요.",
          },
          description: {
            en: "Briefly introduce your group.",
            ko: "그룹에 대해 간략히 소개해주세요.",
          },
          contact: {
            en: "Contact of the group leader.",
            ko: "그룹 리더 연락처",
          },
          socials: {
            en: "Add groups' social links.",
            ko: "그룹의 소셜 계정 링크를 넣어주세요.",
          },
        },
        buttons: {
          submit: {
            en: "Create this group",
            ko: "기도 그룹 만들기",
          },
        },
        placeholders: {
          name: {
            en: "GCYA",
            ko: "은혜의 강",
          },
          description: {
            en: "GCYA (Grace Church Young Adults) is a yogung adult group where we gather to pray for one another.",
            ko: "은혜의 강 청년부는 형제자매 서로를 위해 꾸준히 그리고 끈임없이 기도하는 모임입니다. 같이 기도제목을 공유하고 기도로 응답 받아보아요.",
          },
          contact: {
            email: {
              en: "Leader's email",
              ko: "리더의 이메일",
            },
            name: {
              en: "Leader's name",
              ko: "리더의 이름",
            },
            phone: {
              en: "Leader's phone",
              ko: "리더의 전화번호",
            },
          },
          socials: {
            instagram: {
              en: "Paste in your instagram id.",
              ko: "인스타 계정 링크",
            },
            kakaotalk: {
              en: "Paste in your group' group kakao link.",
              ko: "카카오 그룹 톡 링크",
            },
          },
        },
      },
      groupDetail: {
        titles: {
          containers: {
            prayers: {
              en: "Our Prayers",
              ko: "기도제목 리스트",
            },
            members: {
              en: "List of Members",
              ko: "멤버 리스트",
            },
            accounts: {
              en: "Accounts",
              ko: "소셜 계정 리스트",
            },
            contact: {
              en: "Leader's Contact",
              ko: "그룹 리더 연락처",
            },
          },
        },
        paragraphs: {
          noPrayer: {
            en: "The group does not have a prayer yet.",
            ko: "아직 올려진 기도제목이 없습니다.",
          },
          noMember: {
            en: "The group does not have a member yet.",
            ko: "아직 참여하는 멤버가 없습니다.",
          },
        },
        buttons: {
          view: {
            en: "View",
            ko: "보기",
          },
          edit: {
            en: "Edit",
            ko: "수정",
          },
          delete: {
            en: "Delete",
            ko: "삭제",
          },
          newPrayer: {
            en: "New Prayer",
            ko: "새 기도제목",
          },
          invite: {
            en: "Invite",
            ko: "초대하기",
          },
          close: {
            en: "Close",
            ko: "창 닫기",
          },
          send: {
            en: "Send",
            ko: "보내기",
          },
        },
        placeholders: {
          invite: {
            en: "Enter the email to invite",
            ko: "초대장을 보낼 이메일을 입력해 주세요.",
          },
        },
      },
      createPrayer: {
        titles: {
          head: {
            en: "Create new prayer",
            ko: `새로은 기도제목`,
          },
        },
        form: {
          labels: {
            title: {
              en: "Set a title to your prayer.",
              ko: "기도의 제목을 달아주세요.",
            },
            short: {
              en: "Describe your prayer in a sentence.",
              ko: "한 문장으로 이 기도를 표현해주세요.",
            },
            long: {
              en: "Describe your prayer in detail.",
              ko: "디테일하게 이 기도를 표현해주세요.",
            },

            submit: {
              en: "Create this prayer",
              ko: "기도제목 추가하기",
            },
          },
          placeholders: {
            title: {
              en: "An unhealthy life",
              ko: "건강하지 않은 삶",
            },
            short: {
              en: "I want to take care of my physical health.",
              ko: "요즘 바빠진 일로 인해 육체적인 건강을 못챙김.",
            },
            descriptiion: {
              en: "Recently, I have been busy with my work. As a result, I have been missing out on taking care of my health. I really hope that I have the ability to make the time to do so. Please pray for this. Thank you.",
              ko: "요즘 많이 바빠져서 일 외적으로는 건강을 챙길 수 있는 시간이 거의 없습니다. 이로 인해서 정신적으로도 많이 약해지고 있다는 느낌을 받고있어요. 이 부분을 위해서 다같이 기도해주시면 감사드리겠습니다.",
            },
          },
        },
      },
    },

    buttons: {
      edit: {
        en: "edit",
        ko: "수정",
      },
      delete: {
        en: "delete",
        ko: "삭제",
      },
      newGroup: {
        en: "New Group",
        ko: "새 그룹",
      },
      newPrayer: {
        en: "New Prayer",
        ko: "새 기도제목",
      },
    },
  } as const;

  let extractor = data as unknown as any;
  let i = 0;

  while (true) {
    extractor = extractor[key[i] as unknown as keyof typeof data];
    i++;
    if (i === key.length) {
      break;
    }
  }
  return extractor;
}

export { $ };
