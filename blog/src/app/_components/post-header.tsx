import { PostTitle } from "@/app/_components/post-title";
import { type Author } from "@/interfaces/author";
import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  author: Author;
};

export function PostHeader({ title, coverImage, date, author }: Props) {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div className="flex flex-row gap-x-2">
        <div className="hidden md:block md:mb-8">
          <Avatar name={author.name} picture={author.picture} />
        </div>
        •
        <div className="mb-6 text-lg">
          <DateFormatter dateString={date} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="mb-8 md:mb-16 sm:mx-0 ">
          <CoverImage title={title} src={coverImage} />
        </div>
        <div className="block md:hidden mb-6">
          <Avatar name={author.name} picture={author.picture} />
        </div>
      </div>
    </>
  );
}
