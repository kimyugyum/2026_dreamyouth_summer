interface Props {
  onClick: () => void;
}

export function Fab({ onClick }: Props) {
  return (
    <button className="btn btn-primary fab" onClick={onClick}>
      ＋ 신규 등록
    </button>
  );
}
