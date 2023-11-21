import { getUserAnswers } from "@/lib/actions/user.action";
import React from "react";
import AnswerCard from "../cards/AnswerCard";
import Pagination from "./Pagination";
import { SearchParamsProps } from "@/types";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswersTab = async ({ userId, clerkId, searchParams }: Props) => {
  const result = await getUserAnswers({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });

  console.log(result.answers);
  return (
    <>
      {result.answers.map((item: any) => (
        <AnswerCard
          key={item._id}
          clerkId={clerkId}
          _id={item._id}
          question={item.question}
          author={item.author}
          upvotes={item.upvotes.length}
          createdAt={item.createdAt}
        />
      ))}

      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNextAnswers}
        />
      </div>
    </>
  );
};

export default AnswersTab;
