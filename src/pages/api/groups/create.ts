import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/mongo";
import { Group, GroupProps, User } from "~/types";

type ReturnJson = {
  _id: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReturnJson>
) {
  const method = req.method;

  if (method !== "POST") {
    res.status(400).end();
    return;
  }

  const body = req.body as GroupProps;

  if (!body) {
    res.status(400).end();
    return;
  }

  let group: Group = {
    _id: new ObjectId().toString(),
    data: body,
  };

  const groupDocs = await db("groups");
  const { insertedId } = await groupDocs.insertOne({
    _id: new ObjectId().toString(),
    data: body,
  });

  const userDocs = await db("users");

  const user = (await userDocs.findOne({ _id: body.user_responsible })) as User;

  console.log(user, body.user_responsible);

  await userDocs.updateOne(
    { _id: body.user_responsible },
    {
      $set: {
        data: {
          ...user.data,
          groups:
            user.data.groups.length >= 1
              ? ([insertedId, ...user.data.groups] as string[])
              : ([insertedId] as string[]),
        },
      },
    }
  );

  res.status(200).json({ _id: insertedId as string });
}
