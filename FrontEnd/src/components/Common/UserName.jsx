import { useNavigate } from "react-router-dom";

export default function UserName({ userId, userName }) {
  const navigate = useNavigate();
  return (
    <p
      className="text-[10px] font-black text-slate-400 cursor-pointer tracking-widest mb-1"
      onClick={() => {
        navigate(`/user/${userId}`);
      }}
    >
      {userName}
    </p>
  );
}
