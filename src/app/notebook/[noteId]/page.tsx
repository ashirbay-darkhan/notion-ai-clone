import React from 'react';
import {auth} from "@clerk/nextjs";
import {db} from "@/lib/db";
import {$notes} from "@/lib/db/schema";
import {and, eq} from "drizzle-orm";
import {redirect} from "next/navigation";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {clerk} from "@/lib/clerk-server";
import TipTapEditor from "@/components/TipTapEditor";
import DeleteButton from "@/components/DeleteButton";

type Props = {
  params: {
    noteId: string;
  }
}

const NotebookPage = async ({params: {noteId}} : Props) => {
  const {userId} = await auth()
  if (!userId) {
    return redirect("/dashboard")
  }
  const user = await clerk.users.getUser(userId)
  const notes = await db
    .select()
    .from($notes)
    .where(and(eq($notes.id, parseInt(noteId)), eq($notes.userId, userId)));

  if (notes.length != 1) {
    return redirect("/dashboard");
  }
  const note = notes[0];

  return (
    <div className="min-h-screen grainy p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="border shadow-xl border-stone-200 rounded-lg p-2 lg:p-4 flex items-center">
          <Link href="/dashboard">
            <Button className="bg-green-600" size="sm">
              Back
            </Button>
          </Link>
          <div className="w-3"></div>
          <span className="font-semibold text-sm lg:text-xl">
            {user.firstName} {user.lastName}
          </span>
          <span className="inline-block mx-1">/</span>
          <span className="text-stone-500 font-semibold text-sm lg:text-xl">{note.name}</span>
          <div className="ml-auto">
            <DeleteButton noteId={note.id} />
          </div>
        </div>

        <div className="h-4"></div>
        <div className="border-stone-200 shadow-xl border rounded-lg px-4 lg:px-16 py-8 w-full">
          <TipTapEditor note={note} />
        </div>
      </div>
    </div>
  )
};

export default NotebookPage;