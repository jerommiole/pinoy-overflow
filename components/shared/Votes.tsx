"use client";

import Image from "next/image";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { cn, formatAndDivideNumber } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { useEffect, useOptimistic } from "react";
import { viewQuestion } from "@/lib/actions/interaction.action";
import { toast } from "../ui/use-toast";

interface Props {
  type: "Answer" | "Question";
  itemId: string;
  userId?: string;
  upvotes: string[];
  downvotes: string[];
  saved?: string[];
}

type OptimisticVoteState = {
  downvotes: string[];
  upvotes: string[];
};

type OptimisticVote = {
  type: "upvote" | "downvote";
  userId: string;
};

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  downvotes,
  saved = [],
}: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const [optimisticVotes, addOptimisticVotes] = useOptimistic<
    OptimisticVoteState,
    OptimisticVote
  >({ downvotes, upvotes }, (state, { type, userId }) => {
    if (type === "upvote") {
      if (state.upvotes.includes(userId))
        return {
          ...state,
          upvotes: state.upvotes.filter((id) => id !== userId),
        };
      return {
        upvotes: [...state.upvotes, userId],
        downvotes: state.downvotes.filter((id) => id !== userId),
      };
    }

    if (state.downvotes.includes(userId))
      return {
        ...state,
        downvotes: state.downvotes.filter((id) => id !== userId),
      };

    return {
      upvotes: state.upvotes.filter((id) => id !== userId),
      downvotes: [...state.downvotes, userId],
    };
  });

  const [optimisticSaved, addOptimisticSaved] = useOptimistic<string[], string>(
    saved,
    (state, questionId) =>
      state.includes(questionId)
        ? state.filter((id) => id !== questionId)
        : [...state, questionId]
  );

  const hasUpVoted = userId ? optimisticVotes.upvotes.includes(userId) : false;
  const hasDownVoted = userId
    ? optimisticVotes.downvotes.includes(userId)
    : false;
  const hasSaved = userId ? optimisticSaved.includes(itemId) : false;

  const handleSave = async () => {
    if (!userId) {
      return toast({
        title: "Please log in",
        description: "You need to log in to vote",
      });
    }

    addOptimisticSaved(itemId);
    await toggleSaveQuestion({
      userId,
      questionId: itemId,
      path: pathname,
    });

    return toast({
      title: `Question ${
        !hasSaved ? "Saved in" : "Removed from"
      } your collection`,
      variant: !hasUpVoted ? "default" : "destructive",
    });
  };

  const handleVote = async (action: string) => {
    if (!userId) {
      return toast({
        title: "Please log in",
        description: "You need to log in to vote",
      });
    }

    if (action === "upvote") {
      addOptimisticVotes({ type: "upvote", userId });
      if (type === "Question") {
        await upvoteQuestion({
          questionId: itemId,
          userId,
          hasupVoted: hasUpVoted,
          hasdownVoted: hasDownVoted,
          path: pathname,
        });
      } else if (type === "Answer") {
        await upvoteAnswer({
          answerId: itemId,
          userId,
          hasupVoted: hasUpVoted,
          hasdownVoted: hasDownVoted,
          path: pathname,
        });
      }

      return toast({
        title: `Upvote ${!hasUpVoted ? "Successful" : "Removed"}`,
        variant: !hasUpVoted ? "default" : "destructive",
      });
    }

    if (action === "downvote") {
      addOptimisticVotes({ type: "downvote", userId });
      if (type === "Question") {
        await downvoteQuestion({
          questionId: itemId,
          userId,
          hasupVoted: hasUpVoted,
          hasdownVoted: hasDownVoted,
          path: pathname,
        });
      } else if (type === "Answer") {
        await downvoteAnswer({
          answerId: itemId,
          userId,
          hasupVoted: hasUpVoted,
          hasdownVoted: hasDownVoted,
          path: pathname,
        });
      }

      return toast({
        title: `Downvote ${!hasDownVoted ? "Successful" : "Removed"}`,
        variant: !hasDownVoted ? "default" : "destructive",
      });
    }
  };

  useEffect(() => {
    viewQuestion({
      questionId: itemId,
      userId,
    });
  }, [itemId, userId, pathname, router]);

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <button onClick={() => handleVote("upvote")}>
            <Image
              src="/assets/icons/upvote.svg"
              width={18}
              height={18}
              alt="upvote"
              className={cn("block", hasUpVoted && "hidden")}
            />
            <Image
              src="/assets/icons/upvoted.svg"
              width={18}
              height={18}
              alt="upvoted"
              className={cn("hidden", hasUpVoted && "block")}
            />
          </button>
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium">
              {formatAndDivideNumber(optimisticVotes.upvotes.length)}
            </p>
          </div>

          <button onClick={() => handleVote("downvote")}>
            <Image
              src="/assets/icons/downvote.svg"
              width={18}
              height={18}
              alt="downvote"
              className={cn("block", hasDownVoted && "hidden")}
            />
            <Image
              src="/assets/icons/downvoted.svg"
              width={18}
              height={18}
              alt="downvoted"
              className={cn("hidden", hasDownVoted && "block")}
            />
          </button>

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium">
              {formatAndDivideNumber(optimisticVotes.downvotes.length)}
            </p>
          </div>
        </div>
      </div>

      {type === "Question" && (
        <button onClick={handleSave}>
          <Image
            src="/assets/icons/star-red.svg"
            width={18}
            height={18}
            alt="save"
            className={cn("block", hasSaved && "hidden")}
          />
          <Image
            src="/assets/icons/star-filled.svg"
            width={18}
            height={18}
            alt="saved"
            className={cn("hidden", hasSaved && "block")}
          />
        </button>
      )}
    </div>
  );
};

export default Votes;
