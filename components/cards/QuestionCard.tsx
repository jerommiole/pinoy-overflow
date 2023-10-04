import React from "react";

interface QuestionProps {
  _id: string;
  title: string;
  tags: {
    _id: number;
    name: string;
  }[];
  author: {
    _id: string;
    name: string;
    picture: string;
  };
  upvotes: number;
  views: number;
  answers: Array<object>;
  createdAt: Date;
}

const QuestionCard = ({
  _id,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
}: QuestionProps) => {
  return <div>QuestionCard</div>;
};

export default QuestionCard;
