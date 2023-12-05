import { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/mongo";
import { User } from "~/types";

export default async function hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  if (method !== "PUT") {
    res.status(400).end();
    return;
  }

  const body = req.body as User;

  if (!body) {
    res.status(400).end();
    return;
  }

  const userDocs = await db("users");
  await userDocs.updateOne({ _id: body._id }, { $set: { data: body.data } });

  res.status(200).end();
}
