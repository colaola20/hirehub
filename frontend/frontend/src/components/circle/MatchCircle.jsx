import style from "./MatchCircle.module.css";

export default function MatchCircle({ percent }) {
  const angle = (percent / 100) * 360;

  return (
    <div className={style.circleWrapper}>
      <div
        className={style.circle}
        style={{ background: `conic-gradient(#6a5ee8 ${angle}deg, #312a61 0deg)` }}
      >
        <div className={style.innerCircle}>
          <span className={style.percentText}>{percent}%</span>
          
        </div>
        
      </div>
      
      <p className={style.matchLabel}>Match</p>

    </div>
  );
}
