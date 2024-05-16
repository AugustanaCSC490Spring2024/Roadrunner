import { format, parseISO } from "date-fns";

type Props = {
  dateString: string;
};

const DateFormatter = ({ dateString }: Props) => {
  let date;
  try {
    date = parseISO(dateString);
  } catch (error) {
    return <time>{dateString}</time>; // Fallback to displaying the raw date string
  }

  if (isNaN(date.getTime())) {
    return <time>{dateString}</time>; // Fallback to displaying the raw date string
  }

  return <time dateTime={dateString}>{format(date, "LLLL d, yyyy")}</time>;
};

export default DateFormatter;
