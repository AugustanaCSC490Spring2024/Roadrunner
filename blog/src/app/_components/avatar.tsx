type Props = {
  name: string;
  picture: string;
  fontSize?: string;
};

const Avatar = ({ name, picture, fontSize = "text-lg" }: Props) => {
  return (
    <div className="flex items-center">
      {/* <img src={picture} className="w-12 h-12 rounded-full mr-4" alt={name} /> */}
      <div className={fontSize}>{name}</div>
    </div>
  );
};

export default Avatar;
