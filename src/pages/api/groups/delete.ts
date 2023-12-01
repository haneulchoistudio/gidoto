import { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/mongo";
import { Group, User } from "~/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  if (method !== "DELETE") {
    res.status(400).end();
    return;
  }

  const body = req.body as Group;

  if (!body) {
    res.status(400).end();
    return;
  }

  // 1. remove prayers,
  // 2. remove from members user's props
  // 2. remove from reponsible user's props
  // 3. delete group

  if (body.data.prayers.length >= 1) {
    const prayerDocs = await db("prayers");

    const _deleted = await Promise.all(
      body.data.prayers.map(async (prayer_id) => {
        const { deletedCount } = await prayerDocs.deleteOne({ _id: prayer_id });
        return deletedCount;
      })
    );
  }

  const userDocs = await db("users");

  if (body.data.members.length >= 1) {
    const _modified = await Promise.all(
      body.data.members.map(async (member_id) => {
        const member = (await userDocs.findOne({ _id: member_id })) as User;
        const { modifiedCount } = await userDocs.updateOne(
          { _id: member._id },
          {
            $set: {
              data: {
                ...member.data,
                groups: member.data.groups.filter(
                  (each_group_id) => each_group_id !== body._id
                ),
              },
            },
          }
        );

        return modifiedCount;
      })
    );
  }

  const user = (await userDocs.findOne({
    _id: body.data.user_responsible,
  })) as User;
  await userDocs.updateOne(
    { _id: user._id },
    {
      $set: {
        data: {
          ...user.data,
          groups: user.data.groups.filter(
            (each_group_id) => each_group_id !== body._id
          ),
        },
      },
    }
  );

  const groupDocs = await db("groups");

  await groupDocs.deleteOne({ _id: body._id });

  res.status(200).end();
}
